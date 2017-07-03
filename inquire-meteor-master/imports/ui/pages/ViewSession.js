import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Radio, Table, Alert, Grid, Row, Col, Panel, Accordion, Form, FormGroup, FormControl, ControlLabel, InputGroup, ButtonToolbar, ButtonGroup, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Sessions from '../../api/sessions/sessions';
import Notes from '../../api/sessions/notes';
import Queries from '../../api/sessions/queries';
import { removeSession } from '../../api/sessions/methods';
import NotFound from './NotFound';
import container from '../../modules/container';
import Results from '../../ui/pages/Results.js';
import handleQuery from '../../modules/query';
import handleFilterQuery from '../../modules/filter-query';
import NoteEditor from '../components/NoteEditor';
import Loading from '../components/Loading';
import loader from '../../modules/loader.js';
var FontAwesome = require('react-fontawesome');
import { Session } from 'meteor/session'


const handleEdit = (_id) => {
  browserHistory.push(`/sessions/${_id}/edit`);
};

const handleJoinQuery = (_id) => {
  browserHistory.push(`/sessions/${_id}/join`);
};

const handleRemove = (_id) => {
  if (confirm('Are you sure? This is permanent!')) {
    removeSession.call({ _id }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
        browserHistory.push('/sessions');
      }
    });
  }
};

const handleReQuery = (_id, queryText) => {
  document.querySelector('[name="searchInput"]').value = queryText;
  Meteor.call("reQuery", _id);
}

class ViewSession extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  componentDidMount() {
    handleQuery({ component: this });
    handleFilterQuery({ component: this });
    Session.set("currSessionId",this.props.session._id );
    Session.set("currQueryId",this.props.query._id );
    console.log(this.props.session._id);
    console.log(this.props.query._id);
    console.log(Meteor.userId());
    var util = {
      createdAt: Date.now(),
      sessionId: this.props.session._id,
      queryId: this.props.query._id,
      userId: Meteor.userId()
    };
    Meteor.call("upsertUtil", util);

    setTimeout(() => { document.querySelector('[name="searchInput"]').focus(); }, 0);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleFilterSubmit(event) {
    console.log("in ui");
    event.preventDefault();
  }

  render() {
    // const { session } = this.props.session;
    return this.props.session ? (
    <Grid>
    <Row>
      <div className="ViewDocument">
        <div className="page-header clearfix">
          <h4 className="pull-left">{ this.props.session && this.props.session.title }:
          <small> &nbsp; { this.props.session && this.props.session.description }</small></h4>
          <ButtonToolbar className="pull-right">
            <ButtonGroup bsSize="small">
              <Button onClick={ () => handleEdit(this.props.session._id) }>Edit</Button>
              <Button bsStyle="danger" onClick={ () => handleRemove(this.props.session._id) } className="text-danger">Delete</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>

        <form
          ref={ form => (this.queryForm = form) }
          className="query"
          onSubmit={ this.handleSubmit }
        >
          <FormGroup bsSize="large">
            <InputGroup bsSize="large">
              <FormControl
                type="text"
                ref="searchText"
                name="searchInput"
                defaultValue={ this.props.query && this.props.query.query }
                placeholder="e.g I hate homework "
              />
              <InputGroup.Button>
                <Button type="submit" bsStyle="success">Search</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </form>

        <Accordion>
          <Panel header="Refine Search  &#9660;" eventKey="1">
            <form inline
              ref={ form => (this.filtersForm = form) }
              className="query"
              onSubmit={ this.handleFilterSubmit }
            >
              {/* <FormGroup bsSize="small">
                <ControlLabel>Filter Words</ControlLabel>

                <InputGroup bsSize="small">
                  <FormControl inline
                    type="text"
                    ref="filterText"
                    name="filterInput"
                    placeholder=" e.g sleep"
                  />
                </InputGroup>
              </FormGroup> */}


              <FormGroup bsSize="small">
                <ControlLabel>Num Results</ControlLabel>

                <InputGroup bsSize="small">
                  <FormControl inline
                    type="Number"
                    ref="numResults"
                    name="numResults"
                    defaultValue={ this.props.session.queryParams.numResults }/>
                </InputGroup>
              </FormGroup>


              <FormGroup bsSize="small">
                <ControlLabel>Min words</ControlLabel>

                <InputGroup bsSize="small">
                  <FormControl inline
                    type="Number"
                    ref="minWords"
                    name="minWords"
                    defaultValue={ this.props.session.queryParams.minWords }
                    // placeholder="e.g I hate homework "
                  />
                </InputGroup>
              </FormGroup>


              <FormGroup bsSize="small">
                <ControlLabel>Max words</ControlLabel>

                <InputGroup bsSize="small">
                  <FormControl
                    type="Number"
                    ref="maxWords"
                    name="maxWords"
                    defaultValue={ this.props.session.queryParams.maxWords }
                    // placeholder="e.g I hate homework "
                  />
                </InputGroup>
              </FormGroup>


              <FormGroup>
                <ControlLabel>Current Dataset: { this.props.session.queryParams.dataset }. Change below:</ControlLabel> <br />
                <Radio name="livejournal" inline>
                  Livejournal
                </Radio>
                {' '}
                <Radio name="reddit" inline>
                  Reddit
                </Radio>

              </FormGroup>


              <FormGroup>
                <ControlLabel>Percentage of data to search </ControlLabel>


                <Checkbox inline>
                  1%
                </Checkbox>
                {' '}
                <Checkbox inline>
                  10%
                </Checkbox>
                {' '}
                <Checkbox  inline>
                  100%
                </Checkbox>

              </FormGroup>

              <FormGroup>
                <ControlLabel>Search Model: </ControlLabel>

                <Checkbox  inline>
                  LSTM
                </Checkbox>
                {' '}
                <Checkbox inline>
                  WordToVec
                </Checkbox>

              </FormGroup>

              <Button type="submit" bsStyle="success">
                Save and Apply Filters
              </Button>

            </form>
          </Panel>
        </Accordion>

        </div>
    </Row>

    <Row>
      <Col xs={6} md={9}>
        { this.props.query && this.props.sessionId ? <Results query={this.props.query} sessionId={this.props.sessionId}/> :  <Loading/>}
      </Col>

      <Col xs={6} md={3}>
        <Button bsStyle="primary" onClick={ () => handleJoinQuery(this.props.session._id) }>Run Join Query</Button>
        <br/>
        <br/>

        <ListGroup>
          <ListGroupItem bsStyle="info">Recent Searches</ListGroupItem>
          { this.props.recentQueries.map((query,index) => <ListGroupItem onClick={ () => handleReQuery(query._id,query.query) } key={index} >{query.query}</ListGroupItem> )}
        </ListGroup>

        <ListGroup>
          <ListGroupItem bsStyle="success">Notes</ListGroupItem>
          { this.props.notes.map((note,index) => <ListGroupItem href="#" key={index} >{note.text}</ListGroupItem> )}
          <ListGroupItem href="#link1">
            {/* TODO: chnge query Id to actual queryid */}
          <NoteEditor sessionId={this.props.sessionId} queryId={this.props.sessionId} />
          </ListGroupItem>
        </ListGroup>

        <ListGroup>
          <ListGroupItem bsStyle="warning">Interesting Profiles</ListGroupItem>
          <ListGroupItem href="#link1">Link 1</ListGroupItem>
          <ListGroupItem href="#link2">Link 2</ListGroupItem>
          <ListGroupItem href="#link3">Link 3</ListGroupItem>
          <ListGroupItem href="#link4">Link 4</ListGroupItem>
        </ListGroup>


      </Col>
    </Row>


  </Grid>
  ) : <NotFound />;
}
};

ViewSession.propTypes = {
  session: PropTypes.object,
  sessionId: PropTypes.string,
  notes: PropTypes.array,
  query: PropTypes.object,
  recentQueries: PropTypes.array,
};

export default container((props, onData) => {
  const sessionId = props.params._id;
  Meteor.subscribe('sessions.view', sessionId);
  Meteor.subscribe('notes.list', sessionId);
  // Meteor.subscribe('recentQueries', sessionId);
  const subscription = Meteor.subscribe('queries.list', sessionId);

  if (subscription.ready()) {
    const session = Sessions.findOne(sessionId);
    const notes = Notes.find().fetch();
    const query = Queries.find({}, {sort: {queriedAt: -1}}).fetch()[0];
    const recentQueries = Queries.find({}, {fields: { "query": 1, "_id": 1 },sort: {queriedAt: -1}}).fetch();
    loader();
    if( document.querySelector('[name="searchInput"]') )document.querySelector('[name="searchInput"]').value = query.query;
    onData(null, { session, sessionId, notes, query, recentQueries });
  }
}, ViewSession);
