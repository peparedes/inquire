import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import validate from '../../../modules/validate';
import { Session } from 'meteor/session';
import Loading from '../../components/Loading/Loading';


import './Index.scss';

const goToSession = (history) => {
  event.preventDefault();
  history.push('/sessions/new');
};

const goToAbout = (history) => {
  event.preventDefault();
  history.push('/about');
};

class Index extends React.Component {

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
    const { history } = this.props;
    return (
        <Grid>
          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              <div className="Index">
                <h1>Inquire</h1>
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

      </Grid>);
      }
};

Index.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  return {

  };
}, Index);
