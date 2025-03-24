import { t } from "ttag";

import { updateSettings } from "metabase/admin/settings/settings";
import { connect } from "metabase/lib/redux";
import { getSetting } from "metabase/selectors/settings";
import type { Dispatch, State } from "metabase-types/store";

import type { AuthCardProps } from "../../components/AuthCard";
import AuthCard from "../../components/AuthCard";
import { SSO_TOKEN_SCHEMA } from "../../constants";

type StateProps = Omit<AuthCardProps, "setting" | "onChange" | "onDeactivate">;
type DispatchProps = Pick<AuthCardProps, "onDeactivate">;

const mapStateToProps = (state: State): StateProps => ({
  type: "token",
  name: t`SSO token Sign-in`,
  title: t`Sign in with Token`,
  description: t`Allows users with existing Metabase accounts to login with a third website.`,
  isConfigured: getSetting(state, "token-auth-configured"),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  onDeactivate: () => dispatch(updateSettings(SSO_TOKEN_SCHEMA.getDefault())),
});

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default connect(mapStateToProps, mapDispatchToProps)(AuthCard);


