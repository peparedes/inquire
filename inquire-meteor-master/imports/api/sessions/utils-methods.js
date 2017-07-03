import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import Sessions from './sessions';
import Utils from './utils';


Meteor.methods({
  upsertUtil(util){
    check(util,Object);
    console.log(util);
    Utils.upsert({ _id: util._id }, { $set: util });
  },
});
