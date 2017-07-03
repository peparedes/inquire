/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Bert } from 'meteor/themeteorchef:bert';
import { upsertSession } from '../api/sessions/methods.js';
import './validation.js';

import { Meteor } from 'meteor/meteor';


let component;

const handleUpsert = () => {
  const { session } = component.props;
  const confirmation = session && session._id ? 'Session updated!' : 'Session added!';
  const NewSession = session && session._id ? false : true;
  var query = document.querySelector('[name="title"]').value.trim();
  const upsert = {
    title: document.querySelector('[name="title"]').value.trim(),
    description: document.querySelector('[name="descr"]').value.trim(),
    recentSearches: [{
      query: "No query Yet",
      queryResults: ["No results to render"]
    }],
    queryParams: {
      numResults: 50,
      minWords: 5,
      maxWords: 30,
      filterWords:[],
      dataset: "livejournal"
    },
  };

  if (session && session._id) upsert._id = session._id;
  // var id = Meteor.call("upsertSesh",upsert);
  Meteor.call("upsertSesh",upsert, (error,response) => {
    if (error) {
      console.log(error);
      Bert.alert(error, 'error');
    } else {
      component.sessionEditorForm.reset();
      console.log(response);
      console.log(query);
      if (NewSession){
        Meteor.call("updateSessionQuer",response.insertedId,query, (err,res) => {
          if (err){
            console.log(err);
          } else {
            browserHistory.push(`/sessions/${response.insertedId || session._id}`);
          }
        });
      }
      browserHistory.push(`/sessions/${response.insertedId || session._id}`);
      Bert.alert(confirmation, 'success');
    }
  });
  // browserHistory.push(`/sessions/${response.insertedId || session._id}`);

  // upsertSession.call(upsert, (error, response) => {
  //   if (error) {
  //     console.log(error);
  //     Bert.alert(error.reason, 'danger');
  //   } else {
  //     component.sessionEditorForm.reset();
  //     Bert.alert(confirmation, 'success');
  //     browserHistory.push(`/sessions/${response.insertedId || session._id}`);
  //   }
  // });
};

const validate = () => {
  $(component.sessionEditorForm).validate({
    rules: {
      title: {
        required: true,
      },
      description: {
        required: true,
      },
      recentSearches: {
        required: true,
      },
    },
    messages: {
      title: {
        required: 'Please enter session title.',
      },
      description: {
        required: 'Please describe your session.',
      },
      recentSearches:{
        required: 'Please give'
      },
    },
    submitHandler() { handleUpsert(); },
  });
};

export default function sessionEditor(options) {
  component = options.component;
  validate();
}
