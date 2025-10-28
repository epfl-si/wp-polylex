import MakaRest from 'meteor/maka:rest';

import {
  Categories,
  Responsibles,
} from "/imports/api/collections";
import { EditorState, convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import {Lexes} from "/imports/api/collections/lexes";


async function getLex(lex) {
  let category = await Categories.findOneAsync(lex.categoryId);
  let responsible = await Responsibles.findOneAsync(lex.responsibleId);

  lex.category = category;
  delete lex.categoryId;

  lex.responsible = responsible;
  delete lex.responsibleId;

  // Convert json description to EditorState and convert EditorState to HTML
  lex.descriptionFr = stateToHTML(
    EditorState.createWithContent(
      convertFromRaw(JSON.parse(lex.descriptionFr))
    ).getCurrentContent()
  );

  lex.descriptionEn = stateToHTML(
    EditorState.createWithContent(
      convertFromRaw(JSON.parse(lex.descriptionEn))
    ).getCurrentContent()
  );

  return lex;
}

// Global API configuration
let Api = new MakaRest({
  apiPath: "api/",
  prettyJson: true,
  version: "v1",
  auth: {
    loginType: null
  }
});

// Maps to:
// - /api/v1/lexes
// - /api/v1/lexes?abrogated=0
// - /api/v1/lexes?abrogated=1
Api.addRoute(
  "lexes",
  { authRequired: false },
  {
    get: async function () {
      const query = this.queryParams;
      let newLexes: any[] = [];
      let lexes;

      if (query.isAbrogated) {
        if (['true', '1'].includes(query.isAbrogated)) {
          lexes = await Lexes.find({'isAbrogated': true}).fetchAsync();
        } else if (['false', '0'].includes(query.isAbrogated)) {
          lexes = await Lexes.find({'isAbrogated': {$ne: true}}).fetchAsync();
        }
      } else {
        lexes = await Lexes.find({}).fetchAsync();
      }

      for (const lex of lexes) {
        let newLex = await getLex(lex);
        newLexes.push(newLex);
      }

      return newLexes;
    },
  }
);

// Maps to: /api/v1/lexes/:id
Api.addRoute(
  "lexes/:id",
  { authRequired: false },
  {
    get: async function () {
      let lex = await Lexes.findOneAsync(this.urlParams.id);
      return await getLex(lex);
    },
  }
);

// Maps to: /api/v1/categories/
Api.addRoute(
  "categories",
  { authRequired: false },
  {
    get: async function () {
      return await Categories.find({}).fetchAsync();
    },
  }
);

export default Api;
