import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const AuthenticatedNavigation = ({ name, history }) => (
  <div>
    <Nav>
      <LinkContainer to="/about">
        <NavItem eventKey={1} href="/about">About</NavItem>
      </LinkContainer>
      <LinkContainer to="/sessions">
        <NavItem eventKey={3} href="/sessions">My Sessions</NavItem>
      </LinkContainer>
      {/* <LinkContainer to="/documents">
        <NavItem eventKey={4} href="/documents">Docs</NavItem>
      </LinkContainer> */}
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={2} title={name} id="user-nav-dropdown">
        <LinkContainer to="/profile">
          <NavItem eventKey={2.1} href="/profile">Profile</NavItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem eventKey={2.2} onClick={() => Meteor.logout() }>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
};

export default withRouter(AuthenticatedNavigation);
