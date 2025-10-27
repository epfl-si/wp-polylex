import {
  Categories,
  Responsibles,
} from "/imports/api/collections";
import { EditorState, convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import {Lexes} from "/imports/api/collections/lexes";


declare class Restivus {
  constructor (options?: any);
  public addCollection<T>(collection: Mongo.Collection<T>);
  public addRoute<T>(path: string, conf: {}, routes: {});
}

function getLex(lex) {
  let category = Categories.findOne(lex.categoryId);
  let responsible = Responsibles.findOne(lex.responsibleId);

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
let Api = new Restivus({
  useDefaultAuth: true,
  prettyJson: true,
  version: "v1",
});

// Maps to:
// - /api/v1/lexes
// - /api/v1/lexes?abrogated=0
// - /api/v1/lexes?abrogated=1
Api.addRoute(
  "lexes",
  { authRequired: false },
  {
    get: function () {
      const query = this.queryParams;
      let newLexes: any[] = [];
      let lexes;

      if (query.isAbrogated) {
        if (['true', '1'].includes(query.isAbrogated)) {
          lexes = Lexes.find({'isAbrogated': true}).fetch();
        } else if (['false', '0'].includes(query.isAbrogated)) {
          lexes = Lexes.find({'isAbrogated': {$ne: true}}).fetch();
        }
      } else {
        lexes = Lexes.find({}).fetch();
      }

      lexes.forEach((lex) => {
        let newLex = getLex(lex);
        newLexes.push(newLex);
      });

      return newLexes;
    },
  }
);

// Maps to: /api/v1/lexes/:id
Api.addRoute(
  "lexes/:id",
  { authRequired: false },
  {
    get: function () {
      let lex = Lexes.findOne(this.urlParams.id);
      return getLex(lex);
    },
  }
);

// Maps to: /api/v1/categories/
Api.addRoute(
  "categories",
  { authRequired: false },
  {
    get: function () {
      return Categories.find({}).fetch();
    },
  }
);

export default Api;
