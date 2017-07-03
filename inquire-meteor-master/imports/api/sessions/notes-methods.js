import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import Sessions from './sessions';
import Notes from './notes';


Meteor.methods({
  upsertNote(note){
    check(note,Object);
    Notes.upsert({ _id: note._id }, { $set: note });
  },
});
