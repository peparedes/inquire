import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
var shortid = require('shortid');

const callService = (type, url, options) => new Promise((resolve, reject) => {
  HTTP.call(type, url, options, (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });
});

Meteor.methods({
  queryCommuter(query){
    check(query,String);
    console.log("in method");
    return callService(
      'GET',
      'http://commuter.stanford.edu:9001/query',
      {params:{
        data:query,
        dataset:'livejournal',
        maxWords: 30,
        minWords: 4,
        top: 50,
        percent:10
      }}
    ).then((result) => result.data).catch((error) => {
        throw new Meteor.Error('500', `${error.message}`);
      });
    },
    queryContext(post_id,sent_num){
      check(post_id,Number);
      check(sent_num,Number);
      console.log("in method");
      return callService(
        'POST',
        'http://commuter.stanford.edu:9001/contexts',
        {data:{
            window: 5, // number of +/- sents, or null if you want full posts
	          sents: [[post_id, sent_num]]// tuples of post_id, sent_num (resulting from a query, like above)
        }}
      ).then((result) => result.data).catch((error) => {
          throw new Meteor.Error('500', `${error.message}`);
        });
      },

});
