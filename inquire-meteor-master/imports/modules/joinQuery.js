/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';

import { Session } from 'meteor/session'

let component;

const queryJoinScala = (joinQueryForm) => {
  const { sessionId } = component.props;
  if (document.querySelector('#resLoading')){
    document.querySelector('#resLoading').style.display = 'block';
    document.querySelector('#resDone').style.display = 'none';
  }
  const queryOne = document.querySelector('[name="searchInputOne"]').value;
  const queryTwo = document.querySelector('[name="searchInputTwo"]').value;
  console.log(queryOne);
  console.log(queryTwo);
  console.log(sessionId);
  Meteor.call("joinQuery",sessionId,queryOne,queryTwo);
  console.log("just called method to do join query ");
};

const validate = () => {
  $(component.joinQueryForm).validate({
    rules: {
      searchInputOne: {
        required: true,
      },
      searchInputTwo: {
        required: true,
      },
    },
    messages: {
      searchInputOne: {
        required: 'Need a query here.'
      },
      searchInputTwo: {
        required: 'Need a query here.'
      },
    },
    submitHandler() { queryJoinScala(); },
  });
};

export default function handleJoinQuery(options) {
  component = options.component;
  validate();
}
