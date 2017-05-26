import React, { Component } from 'react';
import { connect } from 'react-redux';

import { LoadingPanel, Error } from '../components/Dashboard';
import { userActions } from '../actions';


import './Dashboard.css';

class Profile extends Component {
  static propTypes = {
    loading: React.PropTypes.bool,
    error: React.PropTypes.string,
    profile: React.PropTypes.object,
    fetchProfile: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchProfile(this.props.profile.id);
  }

  render() {
    const { error, loading, profile } = this.props;

    return (
      <div className="dashboard">
        <div className="row content-header">
          <div className="col-xs-12 order-table-content">
            <h1>Profile</h1>
          </div>
        </div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={ error }/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              Profile: {JSON.stringify(profile)}
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.profile.get('error'),
    loading: state.profile.get('loading'),
    profile: state.profile.get('record').toJS()
  };
}

export default connect(mapStateToProps, { ...userActions })(Profile);
