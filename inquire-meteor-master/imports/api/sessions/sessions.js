import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

const Sessions = new Mongo.Collection('Sessions');
export default Sessions;

Sessions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Sessions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Sessions.schema = new SimpleSchema({
  title: {
    type: String,
    label: 'The title of the session.',
  },
  description: {
    type: String,
    label: 'The description of the session.',
  },
  notes: {
    type: Array,
    label: "Notes associated with the session",
    optional: true
  },
  'notes.$': {
    type: String
  },
  recentSearches: {
    type: Array,
    label: "Recent searches during the session",
    optional: true
  },
  'recentSearches.$': {
    type: Object,
    blackbox: true
  },
  savedProfiles: {
    type: Array,
    label: "Notes associated with the session",
    optional: true
  },
  'savedProfiles.$': {
    type: String
  },
  queryParams: {
    type: Object,
    optional: true,
    blackbox: true
  },
});

Sessions.attachSchema(Sessions.schema);

Factory.define('session', Sessions, {
  title: () => 'Factory Title',
  description: () => 'Factory Description',
});



// # Design Document
//
// 1. Click on sentences to reuse as  a query
// 2. History - up/down arrows OR dropdown OR both
// 3. Highlight words in results with cursor (get highlighted everywhere)
// 4. Sort results alphabetically/numerically
// 5. Zoom - context on hover + link to original page
// 6. Color-based POS tagging
// 7. temporal scale (perhaps a histogram of contributions over time)
// 8. tfidf-based highlighting (most important words)
// 9. bookmarking sentences (assigning sentences to groups)
// 10. cross-dataset search
// 11. switching between models (lstm, word2vec etc.)
//
//
// client to store preferences (aka bookmarking) (users and sentences) for each session
//
// Ask for python server to implement an API - simple queries (text) to more complex( multiple sentences with preferred users).
//
// Pilot studies in one week before formal approval.
//
// Functionality for exporting the data - csv, json, etc.
//
// Workshop soon (May 15th): Aid the process of causal inference.
// Work out a join from the front end
