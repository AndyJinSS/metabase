(ns metabase.sso.api.token
  "/api/token endpoints"
  (:require
    [metabase.api.common :as api]
    [metabase.api.macros :as api.macros]
    [metabase.models.setting :as setting]
    [metabase.sso.settings :as sso.settings]
    [toucan2.core :as t2]))

(api.macros/defendpoint :put "/settings"
 "Update Token Sign-In related settings. You must be a superuser to do this."
 [_route-params
  _query-params
  {:keys [token-auth-sso-url token-auth-enabled]}
   :- [:map
          [:token-auth-sso-url {:optional true} [:maybe :string]]
       [:token-auth-enabled                     {:optional true} [:maybe :boolean]]]]


                        (api/check-superuser)
(t2/with-transaction [_conn]
            (setting/set-many! {:token-auth-sso-url token-auth-sso-url})
            (sso.settings/token-auth-enabled! token-auth-enabled)))

