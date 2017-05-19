import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { login, loadCredentials } from '../actions/auth';
import { LoadingPanel } from '../components/Dashboard';

class LoginContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    loadCredentials: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.auth !== this.props.auth;
  }

  componentWillMount() {
    console.log("Carlos, will Login Mount auth:", this.props.auth);
    if (this.props.auth.isAuthenticated) {
      console.log("Carlos,  Redirecting to:", this.props.auth.returnTo);
      this.props.router.push(this.props.auth.returnTo);
    } else if (!this.props.auth.isAuthenticating) {
      if (window.location.hash) {
        console.log("Carlos, parsing hash hopefully");
        this.props.loadCredentials(this.props.location);
      } else {
        console.log("Carlos, not authenticating");
        this.props.login(this.props.location, 'none');
      }
    }
  }

  render() {
    console.log("Carlos, render login:", this.props.auth);

    if (!this.props.auth.isAuthenticating) {
      return <div></div>;
    }

    return (
      <div className="row">
        <div className="col-xs-12 wrapper">
          <LoadingPanel show={true}>
            Logging In...
          </LoadingPanel>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth.toJS()
  };
}

export default connect(mapStateToProps, { login, loadCredentials })(LoginContainer);
