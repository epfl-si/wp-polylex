import { Lexes, Categories } from '../imports/api/collections.js';

// Global API configuration
let Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true,
    version: 'v1'
});

// Maps to: /api/v1/lexes
Api.addRoute('lexes', {authRequired: false}, {
    get: function () {
        return Lexes.find({}).fetch();
    }
});

// Maps to: /api/v1/lexes/:id
Api.addRoute('lexes/:id', {authRequired: false}, {
    get: function () {
        return Lexes.findOne(this.urlParams.id);
    }
});

// Maps to: /api/v1/categories/
Api.addRoute('categories', {authRequired: false}, {
    get: function() {
      return Categories.find({}).fetch();
    }
  });

export default Api;