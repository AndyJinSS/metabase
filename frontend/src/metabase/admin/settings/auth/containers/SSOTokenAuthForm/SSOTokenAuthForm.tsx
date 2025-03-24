import { connect } from "metabase/lib/redux";
import { getSetting } from "metabase/selectors/settings";
import type { State } from "metabase-types/store";

import { updateSSOTokenSettings } from "../../../settings";
import TokenAuthForm from "../../components/TokenAuthForm";

const mapStateToProps = (state: State) => ({
  isEnabled: getSetting(state, "token-auth-enabled"),
  isSsoEnabled: getSetting(state, "token-features").sso_token,
});

const mapDispatchToProps = {
  onSubmit: updateSSOTokenSettings,
};

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default connect(mapStateToProps, mapDispatchToProps)(TokenAuthForm);
