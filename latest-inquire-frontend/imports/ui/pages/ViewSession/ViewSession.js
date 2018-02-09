import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Grid, Row, Col, FormGroup, InputGroup, FormControl  } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Sessions from '../../../api/Sessions/Sessions';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import validate from '../../../modules/validate';
import { Session } from 'meteor/session';



const goToSession = (history) => {
  event.preventDefault();
  history.push('/sessions/new');
};

const goToAbout = (history) => {
  event.preventDefault();
  history.push('/about');
};

const handleRemove = (sessionId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('sessions.remove', sessionId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Session deleted!', 'success');
        history.push('/sessions');
      }
    });
  }
};


class ViewSession extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => { document.querySelector('[name="searchInput"]').focus(); }, 1200);

    const component = this;
    validate(component.form, {
      rules: {
        searchInput: {
          required: false,
        },
      },
      messages: {
        searchInput: {
          required: 'Need a text in here, Seuss.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    console.log(document.querySelector('[name="searchInput"]').value);
    const searchInputText = document.querySelector('[name="searchInput"]').value;
    document.querySelector('[name="searchInput"]').classList.add('zoomOutUp');
    if(document.querySelector('#resLoading')){
        document.querySelector('#resLoading').style.display = 'block';
        // document.querySelector('#resDone').style.display = 'none';
      }
   Meteor.call('queryCommuter',searchInputText, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        result = response;
        console.log(result);
        Session.set("result", result);
        history.push(`/search/${searchInputText}`);
      }
    });
  }

  render() {
    const { history, doc } = this.props;
    return (
      <div className="ViewSession">
        {/* <div className="page-header clearfix"> */}
          {/* <h4 className="pull-left">{ doc && doc.title }</h4> */}
          <ButtonToolbar className="pull-right">
            <ButtonGroup bsSize="small">
              <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
              <Button onClick={() => handleRemove(doc._id, history)} className="text-danger">
                Delete
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        {/* </div> */}
        {/* { doc && doc.description } */}
        <Grid>
        <Row>
          <Col md={2}></Col>
          <Col md={8}>
            <div className="Index">
              <h1>{ doc && doc.title }</h1>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
              <form ref={form => (this.form = form)} className="query animated pulse" onSubmit={event => event.preventDefault()}>
                  <FormGroup bsSize="large">
                    <InputGroup bsSize="large">
                      <FormControl
                        type="text"
                        ref={searchInput => (this.searchInput = searchInput)}
                        name="searchInput"
                        // defaultValue=""//{ this.props.query && this.props.query.query }
                        placeholder="e.g I hate homework "
                      />
                      <InputGroup.Button>
                        <Button type="submit" bsStyle="primary">Search</Button>
                      </InputGroup.Button>
                    </InputGroup>
                  </FormGroup>
                </form>
                <div id ="resLoading">
                    <Loading/>
                </div>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <Button bsStyle="primary" onClick={() => goToSession(this.props.history)} >Start New Session</Button>
                <span>&nbsp; &nbsp; &nbsp; &nbsp;</span>
                <Button bsStyle="default" onClick={() => goToAbout(this.props.history)} >About Inquire</Button>
            </div>

        </Col>
        <Col md={2}></Col>
      </Row>
    </Grid>

      </div>
        );
      }
};

ViewSession.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const sessionId = match.params._id;
  const subscription = Meteor.subscribe('sessions.view', sessionId);

  return {
    loading: !subscription.ready(),
    doc: Sessions.findOne(sessionId),
  };
}, ViewSession);
