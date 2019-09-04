import { Lexes, Categories, Subcategories, Responsibles } from '../imports/api/collections.js';

function getLex(lex) {

    let category = Categories.findOne(lex.categoryId);
    let subcategory = Subcategories.findOne(lex.subcategoryId);
    let responsible = Responsibles.findOne(lex.responsibleId);
    
    lex.category = category;
    delete lex.categoryId;

    lex.subcategory = subcategory;
    delete lex.subcategoryId;

    lex.responsible = responsible;
    delete lex.responsibleId;

    return lex;
}

// Global API configuration
let Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true,
    version: 'v1'
});

// Maps to: /api/v1/lexes
Api.addRoute('lexes', {authRequired: false}, {
    get: function () {
        let newLexes = [];

        let lexes = Lexes.find({}).fetch();
        lexes.forEach(lex => {
            let newLex = getLex(lex);
            newLexes.push(newLex);
        });

        return newLexes;
    }
});

// Maps to: /api/v1/lexes/:id
Api.addRoute('lexes/:id', {authRequired: false}, {
    get: function () {
        let lex = Lexes.findOne(this.urlParams.id);
        let newLex = getLex(lex);
        return newLex;
    }
});

// Maps to: /api/v1/categories/
Api.addRoute('categories', {authRequired: false}, {
    get: function() {
      return Categories.find({}).fetch();
    }
  });

export default Api;