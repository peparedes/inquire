import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

const Joins = new Mongo.Collection('Joins');
export default Joins;

Joins.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Joins.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Joins.schema = new SimpleSchema({
  queryOne: {
    type: String,
    label: 'The text of the query one',
  },
  queryTwo: {
    type: String,
    label: 'The text of the query two',
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
  resultsArrOne: {
    type: Array,
    label: 'The formatted array of results 1',
    optional: true,
  },
  'resultsArrOne.$': {
    type: Object,
    blackbox: true,
  },
  resultsArrTwo: {
    type: Array,
    label: 'The formatted array of results 2',
    optional: true,
  },
  'resultsArrTwo.$': {
    type: Object,
    blackbox: true,
  },
});

Joins.attachSchema(Joins.schema);

Factory.define('join', Joins, {
  title: () => 'Factory Title',
  description: () => 'Factory Description',
});
