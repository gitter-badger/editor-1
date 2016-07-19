import React, { Component, PropTypes } from 'react'
import { Editor, RichUtils } from 'draft-js'
import { toEditorState } from './helper/content'
import 'draft-js/dist/Draft.css'

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
  { label: 'Paragraph', style: 'paragraph' },
];

const wrapOnChange = (onChange) => (editorState) => onChange({ editorState })

const handleKeyCommand = ({ onChange, editorState }) => (command) => {
  if (RichUtils.handleKeyCommand(editorState, command)) {
    onChange({ editorState })
    return true
  }

  return false
}

class EditView extends Component {
  constructor(props) {
    super(props)
    // FIXME: toEditorState shouldn't be used here, IMHO.
    // We should rather have an API for plugins that describe how to
    // get their initialState (here they could also (un-)serialize the state)
    // And when the editor loads, it builds the initial state from each plugin.
    // With this, you could write the components with only well-defined states
    // in mind. Furthermore, you don't need Component
    this.initialEditorState = toEditorState(props)

    this.toggleBlockType = this.toggleBlockType.bind(this)
  }

  toggleBlockType(blockType) {
    this.onChange({
      editorState:
        RichUtils.toggleBlockType(
          this.props.editorState,
          blockType
        )
    })
  }

  render() {
    const { editorState, onChange, readOnly } = this.props

    return (
      <div>
        <Editor editorState={editorState || this.initialEditorState}
                handleKeyCommand={handleKeyCommand(this.props)}
                onChange={wrapOnChange(onChange)}
                readOnly={readOnly}
                placeholder="Tell your story..."
        />
      </div>
    )
  }
}

EditView.propTypes = {
  editorState: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired
}

export default EditView
