import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import PublicNavigation from './PublicNavigation.js';
import AuthenticatedNavigation from './AuthenticatedNavigation.js';
import container from '../../modules/container';

const renderNavigation = hasUser => (hasUser ? <AuthenticatedNavigation /> : <PublicNavigation />);

const AppNavigation = ({ hasUser }) => (
  <Navbar inverse fixedTop id="mainav">
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">INQUIRE</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      { renderNavigation(hasUser) }
    </Navbar.Collapse>
  </Navbar>
);

AppNavigation.propTypes = {
  hasUser: PropTypes.object,
};

export default container((props, onData) => {
  onData(null, { hasUser: Meteor.user() });
}, AppNavigation);
