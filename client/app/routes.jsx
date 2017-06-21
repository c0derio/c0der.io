import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import App from './containers/App';
import Dashboard from '../dashboard/Dashboard';
import Profile from '../profile/ProfileContainer';
import Projects from '../projects/ProjectsContainer';
import Achievements from '../achievements/AchievementsContainer';
import Login from './auth/containers/Login';
import RequireAuthentication from './auth/containers/RequireAuthentication';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={RequireAuthentication(App)}>
      <IndexRedirect to="dashboard" />
      <Route path="dashboard" component={Dashboard} />
      <Route path="profile" component={Profile} />
      <Route path="projects" component={Projects} />
      <Route path="achievements" component={Achievements} />
    </Route>
    <Route path="/login" component={Login} />
  </Router>;
