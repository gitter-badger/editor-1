import React, { Component, PropTypes } from 'react'
import cssModules from 'react-css-modules'
import Portal from 'react-portal'
import position from 'selection-position'
import { Editor } from 'slate'

import IconButton from 'material-ui/IconButton'
import BoldIcon from 'material-ui/svg-icons/editor/format-bold'
import ItalicIcon from 'material-ui/svg-icons/editor/format-italic'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import BottomToolbar from 'src/editor/components/BottomToolbar'

import nodes from './nodes'
import styles from './index.scoped.css'

const renderNode = (node) => {
  switch (node.type) {
    case 'heading-one':
      return nodes.HeadingOne
    case 'heading-two':
      return nodes.H2
    case 'heading-three':
      return nodes.H3
    case 'code':
      return nodes.CodeNode
    default:
      return nodes.Paragraph
  }
}

const Bold = (props) => <strong {...props} />
const Italic = (props) => <em {...props} />

const renderMark = (mark) => {
  switch (mark.type) {
    case 'bold':
      return Bold
    case 'italic':
      return Italic
    default:
      console.error(`No component specified for mark type ${mark.type}`)
  }
}

/* eslint no-invalid-this: "off" */
class Slate extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => this.updateToolbar()

  shouldComponentUpdate = (nextProps, nextState) => (
    nextProps.editorState !== this.props.editorState
      || nextProps.readOnly !== this.props.readOnly
      || nextState.toolbar !== this.state.toolbar
  )

  componentDidUpdate = () => this.updateToolbar()

  onStateChange = (editorState) => {
    this.props.onChange({ editorState })
  }

  handleOpen = (portal) => {
    this.setState({ toolbar: portal.firstChild })
  }

  updateToolbar = () => {
    const { toolbar } = this.state
    const { editorState } = this.props

    if (!toolbar || editorState.isBlurred || editorState.isCollapsed) {
      return
    }

    const { left, top, width } = position()

    toolbar.style.opacity = 1
    toolbar.style.top = `${top + window.scrollY - toolbar.offsetHeight}px`
    toolbar.style.left = `${left + window.scrollX - (toolbar.offsetWidth / 2) + (width / 2)}px`
  }

  renderMarkButton = (type, icon) => {
    const onClick = (e) => {
      e.preventDefault()

      const { editorState } = this.props

      this.onStateChange(
        // eslint-disable-next-line prefer-reflect
        editorState
          .transform()
          .toggleMark(type)
          .apply()
      )
    }

    const { editorState } = this.props
    const isActive = editorState && editorState.marks.some((mark) => mark.type === type)

    return (
      <IconButton onMouseDown={onClick} iconStyle={isActive ? { color: '#007EC1' } : {}}>
        {icon}
      </IconButton>
    )
  }

  render() {
    const { focused, readOnly, editorState } = this.props
    const isOpened = editorState.isExpanded && editorState.isFocused

    return (
      <div>
        <Portal isOpened={isOpened} onOpen={this.handleOpen}>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <div styleName="toolbar">
              {this.renderMarkButton('bold', <BoldIcon />)}
              {this.renderMarkButton('italic', <ItalicIcon />)}
            </div>
          </MuiThemeProvider>
        </Portal>
        <Editor
          readOnly={Boolean(readOnly)}
          renderNode={renderNode}
          renderMark={renderMark}
          placeholder="Write something..."
          onChange={this.onStateChange}
          state={editorState}
        />
        <BottomToolbar open={focused}>
          Hier könnte Ihre Werbung stehen!
        </BottomToolbar>
      </div>
    )
  }
}

Slate.propTypes = {
  editorState: PropTypes.object,
  focused: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

export default cssModules(Slate, styles)
