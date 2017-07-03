import React from 'react';
import { Grid } from 'react-bootstrap';
import SessionEditor from '../components/SessionEditor.js';

const NewSession = () => (
  <Grid>
  <div className="NewSession">
    <h4 className="page-header">New Session</h4>
    <SessionEditor />
  </div>
</Grid>
);

export default NewSession;
