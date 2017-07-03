// keep a list of size max 30 for recently opened results.
// When plugin is opened, search each of the 30 items, whichever matches first is good!
// Take it's details and use for notes, persona etc.
// This means have a collection with recentOpened, and use ddp to connect. If firewall problems, use own db.
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Radio, Table, Alert, Grid, Row, Col, Panel, Accordion, Form, FormGroup, FormControl, ControlLabel, InputGroup, ButtonToolbar, ButtonGroup, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Sessions from '../../api/sessions/sessions';
import Utils from '../../api/sessions/utils';
import Queries from '../../api/sessions/queries';
import NoteEditor from '../components/NoteEditor';
import container from '../../modules/container';
import { Session } from 'meteor/session'



class Plugin extends React.Component {
    constructor(props){
      super(props);
    }

    render(){
      return (
        <div className="Documents">
          <Grid>
          <Row>
            <br></br>
            <br></br>
            <br></br>
            <Col xs={ 12 }>
              
              <NoteEditor sessionId={ this.props.sessionId } queryId={ this.props.queryId } />
            </Col>
          </Row>
        </Grid>
        </div>
      );
    }

}

Plugin.propTypes = {
  sessionId: PropTypes.string,
  queryId: PropTypes.string,
  userId: PropTypes.string,
};

export default container((props, onData) => {
  const userId = Meteor.userId();
  const subscription = Meteor.subscribe('utils.list', userId);
  if (subscription.ready()) {
    console.log(userId);
    const util = Utils.find({}, {sort: {createdAt: -1}}).fetch()[0];
    console.log(util);
    const sessionId = util.sessionId;
    const queryId = util.queryId;
    onData(null, { sessionId, queryId, userId });
 }
}, Plugin);
