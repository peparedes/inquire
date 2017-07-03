import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Row, Thumbnail, Col, Button, ListGroup, ListGroupItem, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import Sessions from '../../api/sessions/sessions';
import container from '../../modules/container';
import { Session } from 'meteor/session';

//using session variables to pass default query as title of session, no one likes a cold empty house
const handleNav = (_id,title) => {
  Session.set("currSessionId",_id);
  browserHistory.push(`/sessions/${_id}`);
};


const SessionsList = ({ sessions }) => (
  sessions.length > 0 ? <Row> {sessions.map(({ _id, title, description }) => (
      <Col xs={6} md={4} key={ _id } onClick={ () => handleNav(_id,title) }>
        <Thumbnail >
          <h3>{title}</h3>
          <p>{description}</p>
          <p>
            <Button bsStyle="primary">Launch</Button>&nbsp;
            {/* <Button bsStyle="default">Button</Button> */}
          </p>
        </Thumbnail>
      </Col>
    ))} </Row>:
  <Alert bsStyle="warning">No sessions yet.</Alert>
);

SessionsList.propTypes = {
  sessions: PropTypes.array,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('sessions.list');
  if (subscription.ready()) {
    const sessions = Sessions.find().fetch();
    onData(null, { sessions });
  }
}, SessionsList);
