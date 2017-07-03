import React from 'react';
import { Grid, Alert } from 'react-bootstrap';

const NotFound = () => (
  <Grid>
  <div className="NotFound">
    <Alert bsStyle="danger">
      <p><strong>Error [404]</strong>: { window.location.pathname } does not exist.</p>
    </Alert>
  </div>
</Grid>
);

export default NotFound;
