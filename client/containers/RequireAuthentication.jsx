import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export default function RequireAuthentication(InnerComponent) {
  class RequireAuthenticationContainer extends React.Component {
    static propTypes = {
      auth: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired
    }

    componentWillMount() {
      console.log("Carlos: will mount", this.props.auth);
      this.requireAuthentication();
    }

    componentWillReceiveProps() {
      console.log("Carlos: will receive props", this.props.auth);
      this.requireAuthentication();
    }

    requireAuthentication() {
      console.log("Carlos: Requiring authentication", this.props.auth);
      if (!this.props.auth.isAuthenticated && !this.props.auth.isAuthenticating) {
        if (!this.props.location) {
          this.props.router.push('/login');
        } else {
          this.props.router.push(`/login?returnUrl=${this.props.location.pathname}`);
        }
      }
    }

    render() {
      if (this.props.auth.isAuthenticated) {
        return <InnerComponent {...this.props} />;
      }

      return <div></div>;
    }
  }

  return connect((state) => ({ auth: state.auth.toJS() }), { })(RequireAuthenticationContainer);
}
