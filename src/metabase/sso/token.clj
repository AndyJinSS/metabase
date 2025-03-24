(ns metabase.sso.token
  (:require
   [clj-http.client :as http]
   [clojure.string :as str]
   [metabase.api.common :as api]
   [metabase.models.user :as user]
   [metabase.sso.settings :as sso.settings]
   [metabase.util :as u]
   [metabase.util.i18n :refer [deferred-tru tru]]
   [metabase.util.json :as json]
   [metabase.util.log :as log]
   [metabase.util.malli :as mu]
   [metabase.util.malli.schema :as ms]
   [toucan2.core :as t2]))

(defn- self-auth-token-info
  ([token-info-response]
   (let [{:keys [status body]} token-info-response]
     (when-not (= status 200)
       (throw (ex-info (str "Invalid HTTP status: " status) {:status-code 400})))
     (u/prog1 (-> (json/decode+kw body)     ; 解析JSON并保留返回值
                  (:data))                   ; 最终返回user对象
              ;; 验证链
              (let [parsed (json/decode+kw body)]  ; 临时保存解析结果用于验证
                (when-not (= (:code parsed) 2000)   ; 验证业务状态码
                  (throw (ex-info (str "Invalid response code: " (:code parsed))
                                  {:status-code 400})))
                (when-not (:data parsed)           ; 验证data字段存在性
                  (throw (ex-info (tru "Missing data field.") {:status-code 400}))))))))

(mu/defn token-auth-create-new-user!
  "Create a new token Auth user."
  [{:keys [email] :as new-user} :- user/NewUser]
  (log/infof "token-auth-create-new-user")

  ;; this will just give the user a random password; they can go reset it if they ever change their mind and want to
  ;; log in without Google Auth; this lets us keep the NOT NULL constraints on password / salt without having to make
  ;; things hairy and only enforce those for non-Google Auth users
  (user/create-new-token-auth-user! new-user))

(mu/defn- token-auth-fetch-or-create-user! :- (ms/InstanceOf :model/User)
  [name email is-admin]
  (let [existing-user (t2/select-one [:model/User :id :email :last_login :first_name :last_name] :%lower.email (u/lower-case-en email))]
    (or existing-user
      (token-auth-create-new-user! {:first_name name
                                    :is_superuser is-admin
                                     :email email}))))

(defn do-token-auth
  "Call to token auth server to perform an authentication"
  [{{:keys [token]} :body, :as _request}]
  (log/infof "token-auth-sso-url: %s" (sso.settings/token-auth-sso-url))
  (let [token-info-response (http/post (sso.settings/token-auth-sso-url)
                                       {:content-type :json
                                        :body         (json/encode {:token token})})
        {:keys [roles email], realName :name} (self-auth-token-info token-info-response)
        is-admin (boolean (some #{"metabase_admin"} roles))] ; 补外层let的闭合括号
    (log/infof "Successfully authenticated token for: %s %s" realName email) ; 改为realName
    (api/check-500 (token-auth-fetch-or-create-user! realName email is-admin))))

