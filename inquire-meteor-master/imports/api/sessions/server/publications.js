import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Sessions from '../sessions';
import Notes from '../notes';
import Utils from '../utils';
import Joins from '../joins';
import Queries from '../queries';

Meteor.publish('sessions.list', () => Sessions.find());

Meteor.publish('sessions.view', (_id) => {
  check(_id, String);
  return Sessions.find(_id);
});

Meteor.publish('notes.list', (_id) => {
  check(_id, String);
  return Notes.find({sessionId:_id});
});

Meteor.publish('utils.list', (_id) => {
  check(_id, String);
  return Utils.find({userId:_id});
});

Meteor.publish('queries.list', (_id) => {
  check(_id, String);
  return Queries.find({sessionId:_id});
});

Meteor.publish('joins.list', (_id) => {
  check(_id, String);
  return Joins.find({sessionId:_id});
});
