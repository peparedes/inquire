import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import DocumentsList from '../components/DocumentsList';

const Documents = () => (
  <div className="Documents">
    <Grid>
    <Row>
      <Col xs={ 12 }>
        <div className="page-header clearfix">
          <h4 className="pull-left">Documents</h4>
          <Link to="/documents/new">
            <Button
              bsStyle="success"
              className="pull-right"
            >New Document</Button>
          </Link>
        </div>
        <DocumentsList />
      </Col>
    </Row>
  </Grid>
  </div>
);

export default Documents;
