/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import sessionEditor from '../../modules/session-editor.js';

export default class SessionEditor extends React.Component {
  componentDidMount() {
    sessionEditor({ component: this });
    setTimeout(() => { document.querySelector('[name="title"]').focus(); }, 0);
  }

  render() {
    const { session } = this.props;
    return (<form
      ref={ form => (this.sessionEditorForm = form) }
      onSubmit={ event => event.preventDefault() }
    >
      <FormGroup>
        {/* <ControlLabel>Title</ControlLabel> */}
        <FormControl
          type="text"
          name="title"
          defaultValue={ session && session.title }
          placeholder="Session Title"
        />
      </FormGroup>
      <FormGroup>
        {/* <ControlLabel>Description</ControlLabel> */}
        <FormControl
          componentClass="textarea"
          name="descr"
          defaultValue={ session && session.description }
          placeholder="Describe your session some more."
        />
      </FormGroup>
      <Button type="submit" bsStyle="success">
        { session && session._id ? 'Save Changes' : 'Start Session!' }
      </Button>
    </form>);
  }
}

SessionEditor.propTypes = {
  session: PropTypes.object,
};
