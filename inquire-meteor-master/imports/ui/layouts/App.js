import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';
import AppNavigation from '../components/AppNavigation';
import AppFooter from '../pages/AppFooter.js';


const App = ({ children }) => (
  <div>
    <AppNavigation />
    <div className="main">
      { children }
    </div>
    <AppFooter />
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
