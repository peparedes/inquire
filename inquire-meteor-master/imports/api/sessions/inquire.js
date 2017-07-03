import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import Sessions from './sessions';
import Joins from './joins';
var _ = require('underscore');
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

const bufferCallService = function (queryOne,queryTwo,sessionId){
  callService('GET','http://commuter.stanford.edu:9000/query?filter=&maxWords=30&top=50&minWords=5',{params:{data:queryOne}
  })
  .then(function(resultOne){
    console.log("Just queried commuter One join,not printing:");
    // console.log(resultOne.data.query_results[0]);
    //Kinda proud kinda not, there should be a better way to do this. Thought callbacks was hell :(
    callService('GET','http://commuter.stanford.edu:9000/query?filter=&maxWords=30&top=50&minWords=5',{params:{data:queryTwo}
    })
    .then(function(resultTwo){
      console.log("Just queried commuter Two join, now printing both reduced:");

      resOneusers = resultOne.data.url[0];
      resTwousers = resultTwo.data.url[0];

      var uniqUsersOne = _.uniq(resOneusers);
      var uniqUsersTwo = _.uniq(resTwousers);
      var matchingUsers = _.intersection(uniqUsersOne,uniqUsersTwo);

      var resultsOneArr = [];
      for (var i=0; i<50; i++){
        if(_.contains(matchingUsers,resultOne.data.url[0][i])){
          var currObj = {
            shortid: shortid.generate(),
            text: resultOne.data.query_results[0][i],
            cosineSimilarity: resultOne.data.cosine_similarity[i],
            emotion: resultOne.data.emotion[0][i],
            url: resultOne.data.url[0][i],
            visited: false,
            removed: false,
          };
          resultsOneArr.push(currObj);
       }
      }

      var resultsTwoArr = [];
      for (var j=0; j<50; j++){
        if(_.contains(matchingUsers,resultTwo.data.url[0][j])){
          var currObjTwo = {
            shortid: shortid.generate(),
            text: resultTwo.data.query_results[0][j],
            cosineSimilarity: resultTwo.data.cosine_similarity[j],
            emotion: resultTwo.data.emotion[0][j],
            url: resultTwo.data.url[0][j],
            visited: false,
            removed: false,
          };
          resultsTwoArr.push(currObjTwo);
       }
      }
      console.log(resultsTwoArr);
      console.log(resultsOneArr);

      const upsert = {
        queryOne: queryOne,
        queryTwo: queryTwo,
        queriedAt: Date.now(),
        results_count:resultTwo.data.result_count,
        sessionId: sessionId,
      };

      upsert.resultsArrOne = resultsOneArr;
      upsert.resultsArrTwo = resultsTwoArr;
      console.log("About to insert join");
      Meteor.call("insertJoin",upsert);


    }).catch((error) => {
      throw new Meteor.Error('500', `${error.message}`);
    });

  }).catch((error) => {
    throw new Meteor.Error('500', `${error.message}`);
  });
};

Meteor.methods({
  joinQuery(sessionId,queryOne, queryTwo) {
    check(sessionId, String);
    check(queryOne,String);
    check(queryTwo,String);
    console.log('about to query commuter, twice or potentially more later');
    bufferCallService(queryOne,queryTwo,sessionId);
  },
  insertJoin(upsert){
    console.log("called to insert join");
    check(upsert,Object);
    Joins.insert(upsert);
  }
});
