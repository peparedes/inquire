import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

const Queries = new Mongo.Collection('Queries');
export default Queries;

Queries.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Queries.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Queries.schema = new SimpleSchema({
  query: {
    type: String,
    label: 'The text of the query',
  },
  queriedAt: {
    type: Date,
    label: 'Time when query was issued'
  },
  sessionId: {
    type: String,
    label: 'The session Id where query belongs',
  },
  results_count: {
    type: Number,
    label: 'The number of results returned.',
  },
  results: {
    type: Object,
    label: 'The query results',
    blackbox: true,
    optional: true,
  },
  resultsArr: {
    type: Array,
    label: 'The formatted array of results',
    optional: true,
  },
  'resultsArr.$': {
    type: Object,
    blackbox: true,
  },
});

Queries.attachSchema(Queries.schema);

Factory.define('query', Queries, {
  title: () => 'Factory Title',
  description: () => 'Factory Description',
});
