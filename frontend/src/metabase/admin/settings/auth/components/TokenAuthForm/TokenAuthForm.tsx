import { useMemo } from "react";
import { jt, t } from "ttag";
import _ from "underscore";

import Breadcrumbs from "metabase/components/Breadcrumbs";
import FormErrorMessage from "metabase/core/components/FormErrorMessage";
import FormInput from "metabase/core/components/FormInput";
import FormSubmitButton from "metabase/core/components/FormSubmitButton";
import { FormProvider } from "metabase/forms";
import type { SettingDefinition, Settings } from "metabase-types/api";

import { SSO_TOKEN_SCHEMA } from "../../constants";

import {
  TokenAuthForm,
  TokenAuthFormCaption,
  TokenAuthHeader,
} from "./TokenAuthForm.styled";

const ENABLED_KEY = "token-auth-enabled";
const SSO_URL_KEY = "token-auth-sso-url";

const BREADCRUMBS = [
  [t`Authentication`, "/admin/settings/authentication"],
  [t`SSO Token Sign-In`],
];

export interface TokenAuthFormProps {
  elements?: SettingDefinition[];
  settingValues?: Partial<Settings>;
  isEnabled: boolean;
  isSsoEnabled: boolean;
  onSubmit: (settingValues: Partial<Settings>) => void;
}

const SSOTokenAuthForm = ({
  elements = [],
  settingValues = {},
  isEnabled,
  isSsoEnabled,
  onSubmit,
}: TokenAuthFormProps): JSX.Element => {
  const settings = useMemo(() => {
    return _.indexBy(elements, "key");
  }, [elements]);

  const initialValues = useMemo(() => {
    const values = SSO_TOKEN_SCHEMA.cast(settingValues, { stripUnknown: true });
    return { ...values, [ENABLED_KEY]: true };
  }, [settingValues]);

  return (
    <FormProvider
      initialValues={initialValues}
      enableReinitialize
      validationSchema={SSO_TOKEN_SCHEMA}
      validationContext={settings}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <TokenAuthForm disabled={!dirty}>
          <Breadcrumbs crumbs={BREADCRUMBS} />
          <TokenAuthHeader>{t`Sign in with a third server`}</TokenAuthHeader>
          <TokenAuthFormCaption>
            {t``}
          </TokenAuthFormCaption>
          <FormInput
            name={SSO_URL_KEY}
            title={'鉴权服务器地址'}
            description={'请提供鉴权服务器完整接口地址'}
            placeholder={"http://172.11.0.11:9090/api/meta_auth"}
            nullable
            {...getFormFieldProps(settings[SSO_URL_KEY])}
          />
          <FormSubmitButton
            title={isEnabled ? t`Save changes` : t`Save and enable`}
            primary
            disabled={!dirty}
          />
          <FormErrorMessage />
        </TokenAuthForm>
      )}
    </FormProvider>
  );
};

const getFormFieldProps = (setting?: SettingDefinition) => {
  if (setting?.is_env_setting) {
    return { placeholder: t`Using ${setting.env_name}`, readOnly: true };
  }
};

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default SSOTokenAuthForm;
