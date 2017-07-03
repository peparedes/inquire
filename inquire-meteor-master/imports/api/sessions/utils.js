import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

const Utils = new Mongo.Collection('Utils');
export default Utils;

Utils.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Utils.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Utils.schema = new SimpleSchema({
  createdAt: {
    type: Date,
    label: 'The time of creation',
  },
  userId: {
    type: String,
    label: 'The util owner',
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

Utils.attachSchema(Utils.schema);

Factory.define('note', Utils, {
  title: () => 'Factory Title',
  description: () => 'Factory Description',
});
