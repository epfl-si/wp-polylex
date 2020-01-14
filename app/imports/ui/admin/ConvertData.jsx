import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { stateFromHTML } from 'draft-js-import-html';
import { convertToRaw } from 'draft-js';
import { Lexes } from '../../api/collections';

class ConvertData extends Component {

  migrate = () => {    

    this.props.lexes.forEach(lex => {

      let descriptionFr = lex.descriptionFr;
      let descriptionEn = lex.descriptionEn;

      let newDescriptionFr = JSON.stringify(convertToRaw(stateFromHTML(descriptionFr)));
      let newDescriptionEn = JSON.stringify(convertToRaw(stateFromHTML(descriptionEn)));

      lex.jsonDescriptionFr = newDescriptionFr;
      lex.jsonDescriptionEn = newDescriptionEn;

      // Update lex
      Meteor.call(
        'updateLex',
        lex,
        (error, lexId) => {
          if (error) {
            console.log(`${error}`);
          } else {
            console.log(`Lex ${lexId} update`)
          }
        }
      );
    });
  }

  render() {
    let content;
    content = (
      <Fragment>
        <h5 className="card-header">Convert Datas</h5>
        <button className="btn btn-primary" id="importHTML" name="import" onClick={ (e) => this.migrate(e) } >Importer HTML</button>
      </Fragment>
    );
    return content;
  }
}
export default withTracker(() => {
  Meteor.subscribe('lexes');
  let lexes = Lexes.find({}).fetch();
  return {
    lexes: lexes,
  };
})(ConvertData);