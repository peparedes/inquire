import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import SessionsList from '../components/SessionsList';

const Sessions = () => (
  <div className="Sessions">
    <Grid>
    <Row>
      <Col xs={ 12 }>
        <div className="page-header clearfix">
          <h4 className="pull-left">Sessions</h4>
          <Link to="/sessions/new">
            <Button
              bsStyle="success"
              className="pull-right"
            >New Session</Button>
          </Link>
        </div>
        <SessionsList />
      </Col>
    </Row>
  </Grid>
  </div>
);

export default Sessions;
