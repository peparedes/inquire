import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Sessions from './sessions';
import rateLimit from '../../modules/rate-limit.js';

export const upsertSession = new ValidatedMethod({
  name: 'sessions.upsert',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    title: { type: String, optional: true },
    description: { type: String, optional: true },
    recentSearches: { type: Array, optional: true },
  }).validator(),
  run(session) {
    return Sessions.upsert({ _id: session._id }, { $set: session });
  },
});

export const removeSession = new ValidatedMethod({
  name: 'sessions.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Sessions.remove(_id);
  },
});

rateLimit({
  methods: [
    upsertSession,
    removeSession,
  ],
  limit: 5,
  timeRange: 1000,
});
