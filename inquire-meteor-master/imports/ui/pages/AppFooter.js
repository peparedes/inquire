import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col, Button } from 'react-bootstrap';

const AppFooter = () => (
  <div className="AppFooter">
    <Grid>
      <hr className="featurette-divider"></hr>
      <footer>
        <p className="pull-right"><a href="#">Back to top</a></p>
        <p>&copy; 2017 Inquire, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
      </footer>
    </Grid>
  </div>
);

export default AppFooter;
