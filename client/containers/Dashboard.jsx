import React, { Component } from 'react';
import { connect } from 'react-redux';

import { LoadingPanel, Error } from '../components/Dashboard';
import ProjectsTable from '../components/Projects/ProjectsTable';

import './Dashboard.css';

class Dashboard extends Component {
  static propTypes = {
    loadingProfile: React.PropTypes.bool,
    loadingProjects: React.PropTypes.bool,
    loadingAchievements: React.PropTypes.bool,
    errorProfile: React.PropTypes.string,
    errorProjects: React.PropTypes.string,
    errorAchievements: React.PropTypes.string,
    profile: React.PropTypes.object,
    projects: React.PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { loadingProfile, errorProfile, loadingProjects, errorProjects, loadingAchievements, errorAchievements } = this.props;

    const loading = loadingAchievements || loadingProfile || loadingProjects;

    const profile = this.props.profile || {};
    const projects = this.props.projects || [];

    if (!profile) return (<div>1</div>);

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
              <Error message={ errorProfile ? `Profile Error: ${errorProfile}` : null }/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={ errorProjects && `Projects Error: ${errorProjects}` }/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={ errorAchievements && `Achievements Error: ${errorAchievements}` }/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 wrapper">
              Profile: {JSON.stringify(profile)}
            </div>
          </div>
          <div className="row">
            <h3>Projects</h3>
            <div className="col-xs-12 wrapper">
              <ProjectsTable projects={projects} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorProjects: state.projects.get('error'),
    loadingProjects: state.projects.get('loading'),
    errorAchievements: state.achievements.get('error'),
    loadingAchievements: state.achievements.get('loading'),
    errorProfile: state.profile.get('error'),
    loadingProfile: state.profile.get('loading'),
    profile: state.profile.get('record').toJS(),
    projects: state.projects.get('records').toJS()
  };
}

export default connect(mapStateToProps)(Dashboard);
