/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';

import { Session } from 'meteor/session'

let component;

const queryScala = (queryForm) => {
  const { sessionId } = component.props;
  if(document.querySelector('#resLoading')){
    document.querySelector('#resLoading').style.display = 'block';
    document.querySelector('#resDone').style.display = 'none';
  }
  const query = document.querySelector('[name="searchInput"]').value;
  console.log("just changed query to " + query);
  Meteor.call("updateSessionQuer",sessionId,query);
  // Meteor.call("joinQuery", sessionId,query,query);
  console.log("just called method to update query ");
};

const validate = () => {
  $(component.queryForm).validate({
    rules: {
      searchInput: {
        required: true,
      },
    },
    messages: {
      searchInput: {
        required: 'Need a query here.'
      },
    },
    submitHandler() { queryScala(); },
  });
};


export default function handleQuery(options) {
  component = options.component;
  validate();
  // queryScala(component.queryForm);
  // component.loginForm pass this in to next function
  // next function should extract stuff from the form
  // then send the query with all options
}
