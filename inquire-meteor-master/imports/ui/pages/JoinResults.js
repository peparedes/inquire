import React from 'react';
import { Grid, Row, Col, Button, Alert, Table } from 'react-bootstrap';
import Loading from '../components/Loading.js';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import container from '../../modules/container';
import { Session } from 'meteor/session';
var FontAwesome = require('react-fontawesome');


//pass in parameters from the search form in parent to this function
//create a module that fetches and processes the data
//then once the data is present render this stuff,
//could set a loader visible as we wait, then set it not visible once data is returned.

  // const selectRowProp = {
  //   mode: 'checkbox',
  //   bgColor: 'pink'
  // };

  const handleOpenUrl = (url,queryId,shortid) => {
    Meteor.call("markVisited", queryId, shortid);
    var win = window.open(url, '_blank');
    win.focus();
  }

  const handleRemoveResult = (queryId, shortid) => {
    if (confirm('Are you sure? This is permanent!')) {
      Meteor.call("removeResult", queryId, shortid);
    }
  }

  const handleQueryResult = (queryText,sessionId) => {
    document.querySelector('#resLoading').style.display = 'block';
    document.querySelector('#resDone').style.display = 'none';
    document.querySelector('[name="searchInput"]').value = queryText;
    Meteor.call("updateSessionQuer",sessionId, queryText);
  }

  class ShortIdFormatter extends React.Component {
    render() {
      return (
        <a onClick={ () => handleQueryResult(this.props.text, Session.get("currSessionId")) }><FontAwesome name='play-circle-o' /></a>
      );
    }
  }

  function shortidFormatter(cell, row){
    return (
      <ShortIdFormatter sessionId = { row.sessionId } text= { row.text } />
    );
  }

  function renderUserName(url){
    // work name
    var end = url.indexOf(".");
    var name = url.substr(7,end-7);
    console.log(name);
    return name;
  }

  class UrlFormatter extends React.Component {
    render() {
      return (
         <a href="" onClick={ () => handleOpenUrl(this.props.url, this.props.id, this.props.shortid) }> { renderUserName(this.props.url) }</a>
      );
    }
  }

  function urlFormatter(cell, row, index) {
    console.log(row);
    return (
      <UrlFormatter url={ cell } id={ Session.get("currQueryId") } shortid={ row.shortid } />
    );
  }

  class DelFormatter extends React.Component {
    render() {
      return (
        <a onClick={ () => handleRemoveResult(this.props.id, this.props.shortid) } > <FontAwesome name='trash-o' /></a>
      );
    }
  }

  function delFormatter(cell, row, enumObject, index) {
    console.log(Session.get("currQueryId"));
    return (
      <DelFormatter shortid={ cell }  id={ Session.get("currQueryId") } />
    );
  }

  class SimFormatter extends React.Component {
    render() {
      return (
          <span>{ (this.props.cosineSimilarity * 100).toFixed(2) }%</span>
      );
    }
  }

  function simFormatter(cell, row) {
    console.log(row);
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
      defaultSortName: 'text',  // default sort column name
      defaultSortOrder: 'asc',  // default sort order
      afterDeleteRow: onAfterDeleteRow  // A hook for after droping rows.
    };
  }

  render() {
    const { queryArr } = this.props;
    return (
      <div> <div id="resDone">
        <BootstrapTable data={ queryArr } deleteRow={ true } options={ this.options } selectRow={ selectRowProp } responsive striped hover id="searchDone">
          <TableHeaderColumn dataField='shortid' columnClassName={ columnClassNameFormat } isKey dataSort dataFormat={ shortidFormatter } width='4%' hidden>Query</TableHeaderColumn>
          <TableHeaderColumn dataField='text' columnClassName={ columnClassNameFormat } dataSort>Text</TableHeaderColumn>
          <TableHeaderColumn dataField='emotion' columnClassName={ columnClassNameFormat } dataSort width='10%' hidden >Emotion</TableHeaderColumn>
          <TableHeaderColumn dataField='cosineSimilarity' columnClassName={ columnClassNameFormat } dataSort dataFormat={ simFormatter }width='9%' >Similarity</TableHeaderColumn>
          <TableHeaderColumn dataField='url' columnClassName={ columnClassNameFormat } dataSort dataFormat={ urlFormatter } width='15%'>Open</TableHeaderColumn>
          <TableHeaderColumn dataField='shortid' columnClassName={ columnClassNameFormat } dataSort dataFormat={ delFormatter } width='4%' hidden>Delete</TableHeaderColumn>
          <TableHeaderColumn dataField='visited' columnClassName={ columnClassNameFormat } hidden >V</TableHeaderColumn>
        </BootstrapTable> </div> <div id="resLoading"><Loading/></div></div>
    );
  }
}

Results.propTypes = {
  queryArr: PropTypes.array,
};



  // Table notes
  // dataSort - to sort
  // headerAlign='center' dataAlign='right' - to align table headers and dataAlign
  // to hide column, e.g shortid <TableHeaderColumn dataField='id' isKey hidden>Product ID</TableHeaderColumn>
  // styling:
  //   <TableHeaderColumn dataField='name' tdStyle={ { whiteSpace: 'normal' } }>Product Name</TableHeaderColumn>
  //   <TableHeaderColumn dataField='price' thStyle={ { 'fontWeight': 'lighter' } }>Product Price</TableHeaderColumn>


//   Column formatting
//
//   function priceFormatter(cell, row) {
//   return `<i class='glyphicon glyphicon-usd'></i> ${cell}`;
// }
//
// class HtmlColumnFormatTable extends React.Component {
//   render() {
//     return (
//       <BootstrapTable data={ products }>
//         <TableHeaderColumn dataField='id' isKey>Product ID</TableHeaderColumn>
//         <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
//         <TableHeaderColumn dataField='price' dataFormat={ priceFormatter }>Product Price</TableHeaderColumn>
//       </BootstrapTable>
//     );
//   }
// }

// Filter
// =======
//
// <TableHeaderColumn dataField='name' filter={ { type: 'TextFilter', delay: 1000 } }>Product Name</TableHeaderColumn>
 // filter with select
 // ==================
 // <TableHeaderColumn dataField='quality' filterFormatted dataFormat={ enumFormatter } formatExtraData={ qualityType }
          // filter={ { type: 'SelectFilter', options: qualityType } }>Product Quality</TableHeaderColumn>

// Number filter with default value
// ===================================
{/* <TableHeaderColumn dataField='price'
          filter={ {
            type: 'NumberFilter',
            delay: 1000,
            numberComparators: [ '=', '>', '<=' ],
            defaultValue: { number: 50, comparator: '>' }
          } }>
          Product Price
        </TableHeaderColumn> */}

// use All Filter & Clean Filter
// ==============================


// use Selection Hooks for bulk actions maybe?

//pagination!!

// Use trClassName as String on <BootstrapTable>
// columnClassName={ columnClassNameFormat }
// function columnClassNameFormat(fieldValue, row, rowIdx, colIdx) {
//   // fieldValue is column value
//   // row is whole row object
//   // rowIdx is index of row
//   // colIdx is index of column
//   return rowIdx % 2 === 0 ? 'td-column-function-even-example' : 'td-column-function-odd-example';
// }
