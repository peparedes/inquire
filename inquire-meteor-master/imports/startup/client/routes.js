/* eslint-disable max-len */

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/layouts/App.js';
import Documents from '../../ui/pages/Documents.js';
import Sessions from '../../ui/pages/Sessions.js';
import NewDocument from '../../ui/pages/NewDocument.js';
import NewSession from '../../ui/pages/NewSession.js';
import EditDocument from '../../ui/pages/EditDocument.js';
import EditSession from '../../ui/pages/EditSession.js';
import JoinQuery from '../../ui/components/JoinQuery.js';
import ViewDocument from '../../ui/pages/ViewDocument.js';
import ViewSession from '../../ui/pages/ViewSession.js';
import Index from '../../ui/pages/Index.js';
import Landing from '../../ui/pages/Landing.js';
import Login from '../../ui/pages/Login.js';
import Users from '../../ui/pages/Results.js';
import Results from '../../ui/pages/Results.js';
import NotFound from '../../ui/pages/NotFound.js';
import RecoverPassword from '../../ui/pages/RecoverPassword.js';
import ResetPassword from '../../ui/pages/ResetPassword.js';
import Signup from '../../ui/pages/Signup.js';
import Plugin from '../../ui/pages/Plugin.js';

const authenticate = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

// const landIndex = (nextState, replace) => {
//   if (!Meteor.loggingIn() && !Meteor.userId()) {
//     replace({
//       pathname: '/',
//       state: { nextPathname: nextState.location.pathname },
//     });
//   }
// };

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index } onEnter={ authenticate }/>
        <Route name="landing" path="/landing" component={ Landing } />
        <Route name="documents" path="/documents" component={ Documents } onEnter={ authenticate } />
        <Route name="sessions" path="/sessions" component={ Sessions } onEnter={ authenticate } />
        <Route name="newDocument" path="/documents/new" component={ NewDocument } onEnter={ authenticate } />
        <Route name="NewSession" path="/sessions/new" component={ NewSession } onEnter={ authenticate } />
        <Route name="editDocument" path="/documents/:_id/edit" component={ EditDocument } onEnter={ authenticate } />
        <Route name="EditSession" path="/sessions/:_id/edit" component={ EditSession } onEnter={ authenticate } />
        <Route name="results" path="/results" component={ Results } onEnter={ authenticate } />

        <Route name="JoinQuery" path="/sessions/:_id/join" component={ JoinQuery } onEnter={ authenticate } />

        <Route name="viewDocument" path="/documents/:_id" component={ ViewDocument } onEnter={ authenticate } />
        <Route name="viewSession" path="/sessions/:_id" component={ ViewSession } onEnter={ authenticate } />
        <Route name="login" path="/login" component={ Login } />
        <Route name="results" path="/results" component={ Users } />

        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        <Route name="signup" path="/signup" component={ Signup } />
        <Route name="plugin" path="/plugin" component={ Plugin } />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root'),
  );
});
