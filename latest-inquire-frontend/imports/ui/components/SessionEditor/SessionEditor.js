/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class SessionEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        description: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Need a title in here, Seuss.',
        },
        description: {
          required: 'Describe your session, please',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingSession = this.props.doc && this.props.doc._id;
    const methodToCall = existingSession ? 'sessions.update' : 'sessions.insert';
    const doc = {
      title: this.title.value.trim(),
      description: this.description.value.trim(),
    };

    if (existingSession) doc._id = existingSession;

    Meteor.call(methodToCall, doc, (error, sessionId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingSession ? 'Session updated!' : 'Session added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/sessions/${sessionId}`);
      }
    });
  }

  render() {
    const { doc } = this.props;
    return (<form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
      <FormGroup>
        <ControlLabel>Title</ControlLabel>
        <input
          type="text"
          className="form-control"
          name="title"
          ref={title => (this.title = title)}
          defaultValue={doc && doc.title}
          placeholder="Oh, The Places You'll Go!"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Description</ControlLabel>
        <textarea
          className="form-control"
          name="description"
          ref={description => (this.description = description)}
          defaultValue={doc && doc.description}
          placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
        />
      </FormGroup>
      <Button type="submit" bsStyle="success">
        {doc && doc._id ? 'Save Changes' : 'Add Session'}
      </Button>
    </form>);
  }
}

SessionEditor.defaultProps = {
  doc: { title: '', description: '' },
};

SessionEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default SessionEditor;
