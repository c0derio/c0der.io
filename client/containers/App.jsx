import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';
import { authActions, userActions, achievementActions, projectActions } from '../actions';

import Header from '../components/Header';

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func,
    location: PropTypes.object.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    fetchAchievements: PropTypes.func.isRequired,
    fetchProjects: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    // Need to bind logout since it will be called from a callback
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    this.props.fetchProfile(this.props.user.sub);
    this.props.fetchAchievements(this.props.user.sub);
    this.props.fetchProjects(this.props.user.sub);
  }

  logout() {
    console.log('Carlos: logout');
    this.props.logout(this.props.location);
  }

  render() {
    return (
      <div>
        <Header
          user={this.props.user}
          onLogout={this.logout}
        />
        <div className="container">
          <div className="row">
            <section className="content-page current">
              <div className="col-xs-12">
                <div id="content-area" className="tab-content">
                  {React.cloneElement(this.props.children)}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    user: state.auth.get('user'),
  };
}

export default connect(select, { logout, ...authActions, ...userActions, ...achievementActions, ...projectActions })(App);
