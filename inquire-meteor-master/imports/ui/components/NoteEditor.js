/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Grid, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import noteEditor from '../../modules/note-editor.js';

export default class NoteEditor extends React.Component {
  componentDidMount() {
    noteEditor({ component: this });
    // setTimeout(() => { document.querySelector('[name="text"]').focus(); }, 0);
  }

  render() {
    const { note, sessionId, queryId } = this.props;

    return (
      <form ref={ form => (this.noteEditorForm = form) }
      onSubmit={ event => event.preventDefault() }>
      <FormGroup>
        <FormControl
          componentClass="textarea"
          type="text"
          name="text"
          defaultValue= "Notes"
          placeholder="New note"
        />
      </FormGroup>
      <Button type="submit" bsStyle="success">
        { note && note._id ? 'Save Changes' : 'Add Note' }
      </Button>
    </form>);
  }
}


NoteEditor.propTypes = {
  note: PropTypes.object,
  sessionId: PropTypes.string,
  queryId: PropTypes.string,
};
