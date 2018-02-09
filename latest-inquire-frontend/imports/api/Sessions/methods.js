import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Sessions from './Sessions';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'sessions.insert': function sessionsInsert(doc) {
    check(doc, {
      title: String,
      description: String,
    });
    console.log("we inn this biatch");
    try {
      console.log(doc);
      return Sessions.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      console.log(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'sessions.update': function sessionsUpdate(doc) {
    check(doc, {
      _id: String,
      title: String,
      description: String,
    });

    try {
      const sessionId = doc._id;
      Sessions.update(sessionId, { $set: doc });
      return sessionId; // Return _id so we can redirect to session after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'sessions.remove': function sessionsRemove(sessionId) {
    check(sessionId, String);

    try {
      return Sessions.remove(sessionId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'sessions.insert',
    'sessions.update',
    'sessions.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
