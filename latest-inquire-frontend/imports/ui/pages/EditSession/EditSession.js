import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Sessions from '../../../api/Sessions/Sessions';
import SessionEditor from '../../components/SessionEditor/SessionEditor';
import NotFound from '../NotFound/NotFound';

const EditSession = ({ doc, history }) => (doc ? (
  <div className="EditSession">
    <h4 className="page-header">{`Editing "${doc.title}"`}</h4>
    <SessionEditor doc={doc} history={history} />
  </div>
) : <NotFound />);

EditSession.defaultProps = {
  doc: null,
};

EditSession.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const sessionId = match.params._id;
  const subscription = Meteor.subscribe('sessions.view', sessionId);

  return {
    loading: !subscription.ready(),
    doc: Sessions.findOne(sessionId),
  };
}, EditSession);
