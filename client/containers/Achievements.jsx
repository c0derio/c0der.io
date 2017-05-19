import React, { Component } from 'react';
import { connect } from 'react-redux';

import { LoadingPanel, Error } from '../components/Dashboard';

import './Dashboard.css';

class Achievements extends Component {
  static propTypes = {
    loading: React.PropTypes.bool,
    error: React.PropTypes.string,
    achievements: React.PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  render() {
    console.log("Carlos rendering achievements");
    const { error, loading, achievements } = this.props;

    return (
      <div className="dashboard">
        <div className="row content-header">
          <div className="col-xs-12 order-table-content">
            <h1>Dashboard</h1>
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
              Achievements: {JSON.stringify(achievements)}
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.achievements.get('error'),
    loading: state.achievements.get('loading'),
    achievements: state.achievements.get('records').toJS()
  };
}

export default connect(mapStateToProps)(Achievements);
