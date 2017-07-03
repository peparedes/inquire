import React from 'react';
import { Grid, Row, Col, Button,Form, FormGroup,InputGroup,Glyphicon, ControlLabel, FormControl, Thumbnail, Alert, Link } from 'react-bootstrap';
import SessionEditor from '../components/SessionEditor.js';
import SessionsList from '../components/SessionsList.js';

export default class Index extends React.Component {
  componentDidMount() {
    // handleLogin({ component: this }); change to handle search
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
  <div className="Index">
    <Grid>

      {/* This row contains the quick search query input */}
      {/* <Row>
        <Col xs={ 10 } sm={ 10 } md={ 10 } mdPush={1}>
          <br></br>
          <Alert bsStyle="success">
            Create/Join a session and save your progress or simply run quick queries (will be stored under quick queries).
          </Alert>
          <form
            ref={ form => (this.searchForm = form) }
            className="login"
            onSubmit={ this.handleSubmit }
          >
            <FormGroup bsSize="large">
              <InputGroup bsSize="large">
                <FormControl
                  type="text"
                  ref="searchText"
                  name="searchInput"
                  placeholder="e.g I hate homework "
                />
                <InputGroup.Button>
                  <Button>Search</Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>

          </form>
        </Col>
      </Row>*/}
        <Row>
          <br></br>
          <Alert bsStyle="success">
            Create/Join a session and save your progress.
          </Alert>
            <hr/>
          <SessionsList/>
        </Row>
      <Row>

      <Col xs={6} md={4}>
        <Thumbnail>
          <h3>Create New Session</h3>
          <SessionEditor/>

        </Thumbnail>
      </Col>
      </Row>

      </Grid>
  </div>
);
}
}
