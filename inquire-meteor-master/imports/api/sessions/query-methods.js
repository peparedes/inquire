import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import Sessions from './sessions';
import Notes from './notes';
import Queries from './queries';
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
  upsertSesh(session){
    check(session,Object);
    return Sessions.upsert({ _id: session._id }, { $set: session });
  },
  updateSessionQuer(sessionId,query) {
    check(sessionId, String);
    check(query,String);
    // TODO: sanitize queries, max one space, no punctuation
    console.log('about to query commuter');

    var currSesh = Sessions.findOne(sessionId);
    var dataset = currSesh.queryParams.dataset;
    var numResults = currSesh.queryParams.numResults;
    var minWords = currSesh.queryParams.minWords;
    var maxWords = currSesh.queryParams.maxWords;
    callService(
      'GET',
      'http://commuter.stanford.edu:9000/query?filter=',
      {params:{
        data:query,
        dataset:dataset,
        maxWords: maxWords,
        minWords: minWords,
        top: numResults,
        // TODO: add filter
      }}
    ).then(function(result){
      console.log("Just queried commuter, printing:");
      console.log(result.data);

      console.log(result.data.query_results[0]);
      const resultsObject = {
        shortid: shortid.generate(),
        textArray: result.data.query_results[0],
        cosineSimilarityArr: result.data.cosine_similarity,
        emotionsArray: result.data.emotion[0],
        urlsArray: result.data.url[0],
      }
      const upsert = {
        query: result.data.query,
        queriedAt: Date.now(),
        results_count:result.data.result_count,
        sessionId: sessionId,
        results: resultsObject,
      };

      //store status of each result,if visited or not
      //keep count of how many times a query has been run
      var resultsArr = [];
      for (var i=0; i<result.data.result_count; i++){
        var currObj = {
          sessionId: sessionId,
          shortid: shortid.generate(),
          text: result.data.query_results[0][i],
          cosineSimilarity: result.data.cosine_similarity[i],
          emotion: result.data.emotion[0][i],
          url: result.data.url[0][i],
          visited: false,
          removed: false,
        };
        resultsArr.push(currObj);
      }
      upsert.resultsArr = resultsArr;
      var res = Queries.insert(upsert);
      console.log("finished query");
      console.log(res);
      return "done";

    }).catch((error) => {
      throw new Meteor.Error('500', `${error.message}`);
    });

  },
  reQuery(queryId){
    check(queryId,String);
    Queries.update(queryId,{
      $set:{
        queriedAt: Date.now()
      }
    });
  },
  markVisited(queryId, shortid){
    check(queryId,String);
    check(shortid,String);

    var results = Queries.findOne(queryId).resultsArr;
    var resNo;
    for (var i=0; i<results.length;i++){
      if (results[i].shortid == shortid){
        resNo = i;
        break;
      }
    }

    var update = { "$set": { } };
		update["$set"]["resultsArr." + resNo + ".visited"] = true;
		Queries.update(queryId,update);
  },
  removeResult(queryId, shortid){
    check(queryId,String);
    check(shortid,String);
    Queries.update(queryId,{$pull:{"resultsArr":{"shortid":shortid}}});
  },
  updateQueryParams(sessionId,paramsObj){
    check(sessionId, String);
    check(paramsObj, Object);
    Sessions.update(sessionId,{
      $set:{
        'queryParams.dataset': paramsObj.dataset,
        'queryParams.minWords': paramsObj.minWords,
        'queryParams.maxWords': paramsObj.maxWords,
        'queryParams.numResults': paramsObj.numResults,
      }
    });
  },

});
