import { Route } from "metabase/hoc/Title";
import LandApp from "./containers/LandApp";

const getRoutes = (store, IsAuthenticated) => {
  return (
    <Route path="/sso" component={LandApp}>
    </Route>
  );
};

export default getRoutes;
