/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';
import Sessions from '../api/sessions/sessions.js';


import { Session } from 'meteor/session'

let component;

const saveFilters = () => {
  console.log("we here");
  const { sessionId } = component.props;
  const minWords = document.querySelector('[name="minWords"]').value;
  const maxWords = document.querySelector('[name="maxWords"]').value;
  const numResults = document.querySelector('[name="numResults"]').value;


  const itsLJ = document.querySelector('[name="livejournal"]').checked;
  const itsRed = document.querySelector('[name="reddit"]').checked;
  var dataset;
  if (itsLJ) dataset = 'livejournal';
  if (itsRed) dataset = 'reddit';

  var filtersObj = {
    minWords : minWords,
    dataset: Sessions.findOne(sessionId).queryParams.dataset
  }

  if (itsLJ || itsRed){
    filtersObj = {
      minWords : minWords,
      maxWords : maxWords,
      dataset: dataset,
      numResults: numResults,
    }
  }

  Meteor.call("updateQueryParams",sessionId,filtersObj);
  component.filtersForm.reset();

};

const validate = () => {
  $(component.filtersForm).validate({
    rules: {
      minWords: {
        required: false,
      },
    },
    messages: {
      minWords: {
        required: 'Need min here.'
      },
    },
    submitHandler() { saveFilters(); },
  });
};


export default function handleFilterQuery(options) {
  component = options.component;
  validate();
  // queryScala(component.queryForm);
  // component.loginForm pass this in to next function
  // next function should extract stuff from the form
  // then send the query with all options
}
