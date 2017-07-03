import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Documents from '../../api/documents/documents';
import DocumentEditor from '../components/DocumentEditor';
import NotFound from './NotFound';
import container from '../../modules/container';
import { Grid } from 'react-bootstrap';


const EditDocument = ({ doc }) => (doc ? (
  <div className="EditDocument">
    <Grid>
    <h4 className="page-header">Editing "{ doc.title }"</h4>
    <DocumentEditor doc={ doc }/>
  </Grid>
  </div>
) : <NotFound />);

EditDocument.propTypes = {
  doc: PropTypes.object,
};

export default container((props, onData) => {
  const documentId = props.params._id;
  const subscription = Meteor.subscribe('documents.view', documentId);

  if (subscription.ready()) {
    const doc = Documents.findOne(documentId);
    onData(null, { doc });
  }
}, EditDocument);
