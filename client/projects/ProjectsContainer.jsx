import React, { Component } from 'react';
import { connect } from 'react-redux';

import { LoadingPanel, Error } from '../components/Dashboard';

import '../containers/Dashboard.css';

class Projects extends Component {
  static propTypes = {
    loading: React.PropTypes.bool,
    error: React.PropTypes.string,
    projects: React.PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { error, loading, projects } = this.props;

    return (
      <div className="dashboard">
        <div className="row content-header">
          <div className="col-xs-12 order-table-content">
            <h1>Projects</h1>
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
              Projects: {JSON.stringify(projects)}
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.projects.get('error'),
    loading: state.projects.get('loading'),
    projects: state.projects.get('records').toJS()
  };
}

export default connect(mapStateToProps)(Projects);
