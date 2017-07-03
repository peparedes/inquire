import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Sessions from '../../api/sessions/sessions';
import SessionEditor from '../components/SessionEditor';
import NotFound from './NotFound';
import container from '../../modules/container';
import { Grid } from 'react-bootstrap';


const EditSession = ({ session }) => (session ? (
  <div className="EditSession">
    <Grid>
    <h4 className="page-header">Editing "{ session.title }"</h4>
    <SessionEditor session={ session }/>
  </Grid>
  </div>
) : <NotFound />);

EditSession.propTypes = {
  session: PropTypes.object,
};

export default container((props, onData) => {
  const sessionId = props.params._id;
  const subscription = Meteor.subscribe('sessions.view', sessionId);

  if (subscription.ready()) {
    const session = Sessions.findOne(sessionId);
    onData(null, { session });
  }
}, EditSession);
