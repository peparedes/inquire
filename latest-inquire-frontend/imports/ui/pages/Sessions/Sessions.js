import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import SessionsCollection from '../../../api/Sessions/Sessions';
import Loading from '../../components/Loading/Loading';

import './Sessions.scss';

const handleRemove = (sessionId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('sessions.remove', sessionId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Session deleted!', 'success');
      }
    });
  }
};

const Sessions = ({ loading, sessions, match, history }) => (!loading ? (
  <div className="Sessions">
    <div className="page-header clearfix">
      <h4 className="pull-left">Sessions</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Session</Link>
    </div>
    {sessions.length ? <Table responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Last Updated</th>
          <th>Created</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {sessions.map(({ _id, title, createdAt, updatedAt }) => (
          <tr key={_id}>
            <td>{title}</td>
            <td>{timeago(updatedAt)}</td>
            <td>{monthDayYearAtTime(createdAt)}</td>
            <td>
              <Button
                bsStyle="primary"
                onClick={() => history.push(`${match.url}/${_id}`)}
                block
              >View</Button>
            </td>
            <td>
              <Button
                bsStyle="danger"
                onClick={() => handleRemove(_id)}
                block
              >Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table> : <Alert bsStyle="warning">No sessions yet!</Alert>}
  </div>
) : <Loading />);

Sessions.propTypes = {
  loading: PropTypes.bool.isRequired,
  sessions: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('sessions');
  return {
    loading: !subscription.ready(),
    sessions: SessionsCollection.find().fetch(),
  };
}, Sessions);
