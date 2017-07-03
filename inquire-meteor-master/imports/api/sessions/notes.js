import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

const Notes = new Mongo.Collection('Notes');
export default Notes;

Notes.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Notes.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Notes.schema = new SimpleSchema({
  text: {
    type: String,
    label: 'The text of the note.',
  },
  queryId: {
    type: String,
    label: 'The id of the query it belongs to.',
  },
  sessionId: {
    type: String,
    label: 'The id of the session it belongs to.',
  }
});

Notes.attachSchema(Notes.schema);

Factory.define('note', Notes, {
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
