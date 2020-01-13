import React from 'react';
import {
  convertToRaw,
  CompositeDecorator,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';



function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  console.log(url);
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

export class RichEditorExample extends React.Component {

  onChange = editorState => {
    let reference = this.props.reference;
    this.props.onChange(reference, editorState);
  };

  // this.refs.editor correspond à ref="editor" du composant <Editor>
  focus = () => {
    if (this.props.reference == 'descriptionFr') {
      this.refs.descriptionFr.focus();
    } else if (this.props.reference == 'descriptionEn') {
      this.refs.descriptionEn.focus();
    } else {
      this.refs.editor.focus();
    } 
  }
  
  constructor(props) {
    super(props);

    

    let newEditorState = EditorState.set(this.props.editorState, {decorator: decorator});
    this.onChange(newEditorState);
    this.state = {
      editorState: newEditorState,
      showURLInput: false,
      urlValue: '',
    };

    //this.focus = () => this.refs.editor.focus();
    //this.onChange = (editorState) => this.setState({editorState});
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };

    this.promptForLink = this._promptForLink.bind(this);
    this.onURLChange = (e) => this.setState({urlValue: e.target.value});
    this.confirmLink = this._confirmLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);
  }

  _promptForLink(e) {
    e.preventDefault();
    let editorState = EditorState.set(this.props.editorState, {decorator: decorator});
    this.onChange(editorState);
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url,
      }, () => {
        setTimeout(() => this.refs.url.focus(), 0);
      });
    }
  }

  _confirmLink(e) {
    e.preventDefault();
    const {urlValue} = this.state;
    let editorState = EditorState.set(this.props.editorState, {decorator: decorator});
    this.onChange(editorState);
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    const newES = RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey
    );
    this.onChange(newES);
    this.setState({
      editorState: newES,
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
  }

  _onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }

  _removeLink(e) {
    e.preventDefault();
    let editorState = EditorState.set(this.props.editorState, {decorator: decorator});
    this.onChange(editorState);
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {

      
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
    }
  }

  render() {
    let editorState = EditorState.set(this.props.editorState, {decorator: decorator});
    let urlInput;
    if (this.state.showURLInput) {
      urlInput =
        <div style={styles.urlInputContainer}>
          <input
            onChange={this.onURLChange}
            ref="url"
            style={styles.urlInput}
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onLinkInputKeyDown}
          />
          <button onMouseDown={this.confirmLink}>
            Confirm
          </button>
        </div>;
    }

    return (
      
      <div style={styles.root}>
        <div style={{marginBottom: 10}}>
          Select some text, then use the buttons to add or remove links
          on the selected text.
        </div>
        <div style={styles.buttons}>
          <button
            type="button"
            onMouseDown={this.promptForLink}
            style={{marginRight: 10}}>
            Add Link
          </button>
          <button type="button" onMouseDown={this.removeLink}>
            Remove Link
          </button>
        </div>
        {urlInput}
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            placeholder="Enter some text..."
            ref={this.props.reference}
          />
        </div>
        <input
          onClick={this.logState}
          style={styles.button}
          type="button"
          value="Log State"
        />
      </div>
    );
  }
}


const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    color: '#3b5998',
    textDecoration: 'underline',
  },
};