import { updateIn } from "icepick";

import SSOTokenAuthCard from "metabase/admin/settings/auth/containers/SSOTokenAuthCard";
import SSOTokenAuthForm from "metabase/admin/settings/auth/containers/SSOTokenAuthForm";
import {
  PLUGIN_ADMIN_SETTINGS_UPDATES,
  PLUGIN_IS_PASSWORD_USER,
} from "metabase/plugins";


PLUGIN_ADMIN_SETTINGS_UPDATES.push(sections =>
  updateIn(sections, ["authentication", "settings"], settings => [
    ...settings,
    {
      key: "token-auth-enabled",
      description: null,
      noHeader: true,
      widget: SSOTokenAuthCard,
    },
  ]),
);

PLUGIN_ADMIN_SETTINGS_UPDATES.push(sections => ({
  ...sections,
  "authentication/token": {
    component: SSOTokenAuthForm,
    settings: [
      { key: "token-auth-sso-url" },
    ],
  },
}));

PLUGIN_IS_PASSWORD_USER.push(user => user.sso_source !== 'token');
