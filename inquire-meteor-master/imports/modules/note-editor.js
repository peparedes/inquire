/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Bert } from 'meteor/themeteorchef:bert';
import { upsertSession } from '../api/sessions/notes-methods.js';
import './validation.js';
import { Meteor } from 'meteor/meteor';

let component;

const handleUpsert = () => {
  const { note, sessionId, queryId } = component.props;
  const confirmation = note && note._id ? 'Note updated!' : 'Note added!';
  const upsert = {
    text: document.querySelector('[name="text"]').value.trim(),
    queryId:queryId,
    sessionId: sessionId
  };
  if (note && note._id) upsert._id = note._id;
  Meteor.call("upsertNote",upsert, (error,response) => {
    if (error) {
      Bert.alert(error, 'error');
    } else {
      component.noteEditorForm.reset();
      Bert.alert('Note added!', 'success');
    }
  });
  // Meteor.call("upsertNote",upsert);
};

const validate = () => {
  $(component.noteEditorForm).validate({
    rules: {
      text: {
        required: true,
      },
    },
    messages: {
      text: {
        required: 'Please enter note text.',
      },
    },
    submitHandler() { handleUpsert(); },
  });
};

export default function noteEditor(options) {
  component = options.component;
  validate();
}
