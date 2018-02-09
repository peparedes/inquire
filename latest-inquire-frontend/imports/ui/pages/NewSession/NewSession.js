import React from 'react';
import PropTypes from 'prop-types';
import SessionEditor from '../../components/SessionEditor/SessionEditor';

const NewSession = ({ history }) => (
  <div className="NewSession">
    <h4 className="page-header">New Session</h4>
    <SessionEditor history={history} />
  </div>
);

NewSession.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewSession;
