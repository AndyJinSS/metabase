import { useEffect, useState } from "react";
import { push } from "react-router-redux";

import { connect } from "metabase/lib/redux";
import { getUser } from "metabase/selectors/user";
import { TokenAuthApi } from "metabase/services";
import { Flex, Loader } from "metabase/ui";

const mapStateToProps = (state: any, props: any) => {
  console.log('LandApp', props)
  return ({
    user: getUser(state),
    path: props.location.pathname,
    query: props.location.query,
  })
};


const mapDispatchToProps = {
  onChangeLocation: push,
};

const SSOLandingPage = (props: any) => {
  const [status, setStatus] = useState<boolean>(true);
  useEffect(() => {
    const { token, url } = props.query;
    if (token && url) {
      TokenAuthApi.loginWithToken({ token: props.query.token })
        .then(response => {
          props.onChangeLocation(url);
        })
        .catch(error => {
          console.log(error)
          props.onChangeLocation('/login');
          setStatus(false)
        });
    } else {
      setStatus(false)
    }
  }, [props.query]);
  return (
    <Flex style={{paddingTop: 100}} direction="column" align="center" justify="center" >
      <Loader  className="mt" size="xl" />
      <span style={{marginTop: 20}}>{status ? '跳转中...' : '无效操作'}</span>
    </Flex>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SSOLandingPage);
