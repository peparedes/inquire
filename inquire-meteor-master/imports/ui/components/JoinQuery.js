import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Grid, Row, Col, Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Sessions from '../../api/sessions/sessions';
import Joins from '../../api/sessions/joins';
import Queries from '../../api/sessions/queries';
import NotFound from '../pages/NotFound';
import container from '../../modules/container';
import handleJoinQuery from '../../modules/joinQuery.js';
import loader from '../../modules/loader.js';
import JoinResults from '../../ui/pages/JoinResults.js';
import Loading from '../components/Loading';


//play nicely with modules/joinQuery.js and api inquire.js=>returns two arrays, need to feed into joins.js
class JoinQuery extends React.Component {
  componentDidMount() {
    handleJoinQuery({ component: this });
    setTimeout(() => { document.querySelector('[name="searchInputOne"]').focus(); }, 0);
  }

  render() {
    const { query, session, sessionId } = this.props;
    return (<Grid>
        <Row>
        <br/>
        <br/>
        <br/>
      <form ref={ form => (this.joinQueryForm = form) }
      onSubmit={ event => event.preventDefault() }>
      <FormGroup>
        <FormControl
          type="text"
          name="searchInputOne"
          defaultValue = {query && query.queryOne}
          placeholder="query one"
        />
      </FormGroup>

      <FormGroup>
        <FormControl
          type="text"
          name="searchInputTwo"
          defaultValue = {query && query.queryTwo}
          placeholder="query two"
        />
      </FormGroup>

      <Button type="submit" bsStyle="success">
        Query
      </Button>
    </form>
  </Row>
  <br/>

  <Row>
    <Col xs={6} md={6}>
      <h4>{query && query.queryOne}</h4>
      { query && sessionId ? <JoinResults queryArr={query.resultsArrOne} sessionId={sessionId}/> :  <Loading/>}
    </Col>
    <Col xs={6} md={6}>
      <h4>{query && query.queryTwo}</h4>
      { query && sessionId ? <JoinResults queryArr={query.resultsArrTwo} sessionId={sessionId}/> :  <Loading/>}
    </Col>
  </Row>
  </Grid>);
  }
}

JoinQuery.propTypes = {
  session: PropTypes.object,
  sessionId: PropTypes.string,
  query: PropTypes.object,
};

export default container((props, onData) => {
  const sessionId = props.params._id;
  Meteor.subscribe('sessions.view', sessionId);
  const subscription = Meteor.subscribe('joins.list', sessionId);
  console.log("we here");
  if (subscription.ready()) {
    const session = Sessions.findOne(sessionId);
    const query = Joins.find({}, {sort: {queriedAt: -1}}).fetch()[0];
    console.log(query);
    loader();
    if( document.querySelector('[name="searchInputOne"]') )document.querySelector('[name="searchInputOne"]').value = query.queryOne;
    if( document.querySelector('[name="searchInputTwo"]') )document.querySelector('[name="searchInputTwo"]').value = query.queryTwo;
    onData(null, { session, sessionId, query });
  }
}, JoinQuery);
