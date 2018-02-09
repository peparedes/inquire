import React from 'react';
import { Grid, Row, Col, Button, Alert, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import Loading from '../Loading/Loading';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
var FontAwesome = require('react-fontawesome');
var alertify = require('alertify.js'); //coz alertify is weird

import './Results.scss';

//pass in parameters from the search form in parent to this function
//create a module that fetches and processes the data
//then once the data is present render this stuff,
//could set a loader visible as we wait, then set it not visible once data is returned.


  const handleOpenUrl = (url,queryId, shortid) => {
    event.preventDefault();
    Meteor.call("markVisited", queryId, shortid);
    var win = window.open(url, '_blank');
    win.focus();
    return false;
  }

  const handleGetContext = (post_id,sent_num) => {
    Meteor.call('queryContext',post_id,sent_num, (error, response) => {
       if (error) {
         Bert.alert(error.reason, 'danger');
       } else {
         result = response;
         // console.log(result);
         // result.query_results[0].context = array of all sentences with curr sent midway
         // TODO: from each sent in array above, create sentence to be show in modal below.
         var contexts = result.query_results[0].context;
         var sentence = '';
         for(var i=0; i< contexts.length; i++){
           sentence += contexts[i];
         }
         console.log(sentence);

         Bert.defaults = {
            hideDelay: 93500,
            // Accepts: a number in milliseconds.
            style: 'fixed-top',
            // Accepts: fixed-top, fixed-bottom, growl-top-left,   growl-top-right,
            // growl-bottom-left, growl-bottom-right.
            type: 'info'
            // Accepts: default, success, info, warning, danger.
          };

         Bert.alert({
            hideDelay: 93500,
            type: 'info',
            style: 'fixed-top',
            title: 'Context Expansion',
            message: sentence,
            icon: 'fa-close'
          });


       }
     });

  }

  const handleSaveUser = (queryId, shortid, username) => {
    if (confirm('Are you sure? This is permanent!')) {
      // Meteor.call("removeResult", queryId, shortid);
      var prof = {
        queryId: queryId,
        sessionId: Session.get("currSessionId"),
        username: username
      };
      Meteor.call("upsertProfile", prof);
    }
  }

  const handleQueryResult = (queryText,sessionId) => {
    document.querySelector('#resLoading').style.display = 'block';
    document.querySelector('#resDone').style.display = 'none';
    document.querySelector('[name="searchInput"]').value = queryText;
    var searchInputText = queryText;


    if(document.querySelector('#resLoading')){
        document.querySelector('#resLoading').style.display = 'block';
        document.querySelector('#resDone').style.display = 'none';
      }
   Meteor.call('queryCommuter',searchInputText, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        result = response;
        console.log(result);
        Session.set("result", result);
        if(document.querySelector('#resLoading')){
            document.querySelector('#resLoading').style.display = 'none';
            document.querySelector('#resDone').style.display = 'block';
          }
      }
    });
  }



  var currTitle = 50.00;
  const handlePopover = (titll) => {
    console.log("called with " + titll);
    currTitle = titll;
    // Session.set("currTitle",titll)
  }

  const getCurrTitle = function(){
    return 50;
    // return currTitle;
  }

  class ShortIdFormatter extends React.Component {
    render() {
      return (
        <a onClick={ () => handleQueryResult(this.props.text, Session.get("currSessionId")) }><FontAwesome name='search' /></a>
      );
    }
  }

  function shortidFormatter(cell, row){
    return (
      <ShortIdFormatter sessionId = { row.sessionId } text= { row.sent_text } />
    );
  }

  function renderUserName(url){
    // work name
    var end = url.indexOf(".");
    var name = url.substr(7,end-7);
    return name;
  }

  class TextFormatter extends React.Component {
    render() {
      return (
          <span>{this.props.text}</span>
      );
    }
  }

  class UrlFormatter extends React.Component {
    render() {
      return (
          <small><a href="#" onClick={ () => handleOpenUrl(this.props.url,this.props.id, this.props.shortid) }>{ renderUserName(this.props.url) }</a></small>
      );
    }
  }

  class ContextFormatter extends React.Component {
    render() {
      return (
        <small>See Context <a onClick={ () => handleGetContext(this.props.post_id, this.props.sent_num) }>  <FontAwesome name='expand' /> </a></small>
      );
    }
  }

  function urlFormatter(cell, row, index) {
    // console.log(row);
    return (
      <div>
      <DelFormatter shortid={ cell }  id={ Session.get("currQueryId") } username={ name } /> &nbsp; <UrlFormatter url={ cell } id={ Session.get("currQueryId") } shortid={ row.post_id } /> <br/>
      <ShortIdFormatter sessionId = { row.sessionId } text= { row.sent_text } /> &nbsp; <TextFormatter text={ row.sent_text } /><br/>
      <ContextFormatter post_id={ row.post_id } sent_num={ row.sent_num }  />
    </div>
    );
  }

  class QueryFormatter extends React.Component {
    render() {
      return (
        <a onClick={ () => handleAddQuery(this.props.text, Session.get("currSessionId")) } ><FontAwesome name='search-plus' /></a>
      );
    }
  }

  function queryFormatter(cell, row) {
    return (
      <QueryFormatter sessionId = { row.sessionId } text= { row.sent_text } />
    );
  }

  class OpenFormatter extends React.Component {
    render() {
      return (
        <a onClick={ () => handleSaveUser(this.props.id, this.props.shortid, this.props.username) } ><FontAwesome name='window-restore' /></a>
      );
    }
  }

  class DelFormatter extends React.Component {
    render() {
      return (
        <a onClick={ () => handleSaveUser(this.props.id, this.props.shortid, this.props.username) } ><FontAwesome name='user-plus' /></a>
      );
    }
  }

  function delFormatter(cell, row, enumObject, index) {
    // console.log(Session.get("currQueryId"));
    var end = row.url.indexOf(".");
    var name = row.url.substr(7,end-7);
    return (<div>
      {/* <DelFormatter shortid={ cell }  id={ Session.get("currQueryId") } username={ name } /> &nbsp; &nbsp; &nbsp; */}
      <OpenFormatter shortid={ cell }  id={ Session.get("currQueryId") } username={ name } /><br/>
      {/* <ShortIdFormatter sessionId = { row.sessionId } text= { row.sent_text } /> &nbsp; &nbsp; &nbsp; */}
      <QueryFormatter sessionId = { row.sessionId } text= { row.sent_text } />

    </div>
    );
  }

  const handleAddQuery = (queryText,sessionId) => {
    //clean up query, remove spaces and . at the end
    var query = queryText;
    var query_len = queryText.length;
    if (queryText.endsWith('.')){
      query = queryText.slice(0,query_len-1);
    }
    query.trim();

    var newQuery = Session.get("currQueryText") + ' ' + query;
    document.querySelector('[name="searchInput"]').value = newQuery;
    // We can elect to run query right after click or wait for user to manually search,
    // currently we wait for user. If we decide otherwise, siply uncomment the last three lines below.
    Session.set("currQueryText", newQuery);
    // document.querySelector('#resLoading').style.display = 'block';
    // document.querySelector('#resDone').style.display = 'none';
    // Meteor.call("updateSessionQuer",sessionId, newQuery);
    var searchInputText = newQuery;
    if(document.querySelector('#resLoading')){
        document.querySelector('#resLoading').style.display = 'block';
        document.querySelector('#resDone').style.display = 'none';
      }
   Meteor.call('queryCommuter',searchInputText, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        result = response;
        console.log(result);
        Session.set("result", result);
        if(document.querySelector('#resLoading')){
            document.querySelector('#resLoading').style.display = 'none';
            document.querySelector('#resDone').style.display = 'block';
          }
      }
    });

  }



// var currTitle = Session.get("currTitle");
const popoverHoverFocus = (
  <Popover id="popover-trigger-hover-focus" title={ Session.get("currTitle") }>
    <strong>Holy guacamole!</strong> Check this info.
  </Popover>
);


  class SimFormatter extends React.Component {
    render() {
      return (
        <span onMouseOver={ Session.set("currTitle", (this.props.cosineSimilarity * 100).toFixed(2).toString()) }>
        <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverFocus}>
          <span>{ (this.props.cosineSimilarity * 100).toFixed(2) }%</span>
        </OverlayTrigger>
      </span>
      );
    }
  }

  function simFormatter(cell, row) {
    // console.log(row);
    return (
      <SimFormatter cosineSimilarity={ cell } />
    );
  }

  // table stuff
  function onAfterDeleteRow(rowKeys) {
      // alert('The rowkey you drop: ' + rowKeys);
      console.log(rowKeys[0]);
      Meteor.call("removeResult", Session.get("currQueryId"), rowKeys[0]);
    }

    const options = {
      afterDeleteRow: onAfterDeleteRow  // A hook for after droping rows.
    };

    // If you want to enable deleteRow, you must enable row selection also.
    const selectRowProp = {
      mode: 'checkbox',
      bgColor: 'pink'
    };

    function columnClassNameFormat(fieldValue, row, rowIdx, colIdx) {
      // fieldValue is column value
      // row is whole row object
      return row.visited ? 'greenbg' : '';
      // rowIdx is index of row
      // colIdx is index of column
      // return fieldValue ? 'greenbg' : '';
    }

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.options = {
      defaultSortName: 'similarity',  // default sort column name
      defaultSortOrder: 'desc',  // default sort order
      afterDeleteRow: onAfterDeleteRow  // A hook for after droping rows.
    };
  }

  render() {
    const { query } = this.props;
    Session.set("currQueryId", "lol");
    Session.set("currQueryText", query.query);
    return (
      <div> <div id="resDone">
        <BootstrapTable data={ query.query_results } deleteRow={ false } options={ this.options } responsive striped hover id="searchDone">
          {/* <TableHeaderColumn dataField='post_id' columnClassName={ columnClassNameFormat } isKey dataSort dataFormat={ shortidFormatter } width='4%'>Query</TableHeaderColumn> */}
          <TableHeaderColumn dataField='sent_text' columnClassName={ columnClassNameFormat } hidden>Text</TableHeaderColumn>
          <TableHeaderColumn dataField='sent_num' columnClassName={ columnClassNameFormat } hidden>num</TableHeaderColumn>
          <TableHeaderColumn dataField='similarity' columnClassName={ columnClassNameFormat } dataSort dataFormat={ simFormatter } width='7%'>Similarity</TableHeaderColumn>
          <TableHeaderColumn dataField='url' columnClassName={ columnClassNameFormat } dataSort dataFormat={ urlFormatter } width='90%' >result</TableHeaderColumn>
          <TableHeaderColumn dataField='post_id' columnClassName={ columnClassNameFormat } isKey dataFormat={ delFormatter } width='3%'>Action</TableHeaderColumn>
          <TableHeaderColumn dataField='visited' columnClassName={ columnClassNameFormat } hidden >V</TableHeaderColumn>
        </BootstrapTable> </div> <div id="resLoading"><Loading/></div></div>
    );
  }
}

Results.propTypes = {
  query: PropTypes.object,
};

//query-string, query_results=[], result_count-int
// {
//             "ext_post_id": 104838,
//             "post_id": 65792160,
//             "post_time": 1076562120,
//             "sent_num": 5,
//             "sent_text": "I swear, I hate homework!!!!",
//             "similarity": 0.96,
//             "url": "http://angl5996.livejournal.com/104838.html",
//             "username": "angl5996"
//         }
