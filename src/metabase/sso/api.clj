(ns metabase.sso.api
  (:require
   [metabase.api.macros :as api.macros]
   [metabase.sso.api.google]
   [metabase.sso.api.ldap]
   [metabase.sso.api.token]))

(comment metabase.sso.api.google/keep-me
  metabase.sso.api.ldap/keep-me
  metabase.sso.api.token/keep-me)

(def ^{:arglists '([request respond raise])} google-auth-routes
  "`/api/google/` routes."
  (api.macros/ns-handler 'metabase.sso.api.google))

(def ^{:arglists '([request respond raise])} ldap-routes
  "`/api/ldap` routes."
  (api.macros/ns-handler 'metabase.sso.api.ldap))

(def ^{:arglists '([request respond raise])} token-routes
  "`/api/token` routes."
  (api.macros/ns-handler 'metabase.sso.api.token))
