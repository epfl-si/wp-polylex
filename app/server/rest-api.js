import { Lexs } from '../imports/api/collections.js';

// Global API configuration
let Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true,
    version: 'v1'
});

// Maps to: /api/v1/lexs
Api.addRoute('lexs', {authRequired: false}, {
    get: function () {
        return Lexs.find({}).fetch();
    }
});

// Maps to: /api/v1/lexs/:id
Api.addRoute('lexs/:id', {authRequired: false}, {
    get: function () {
        return Lexs.findOne(this.urlParams.id);
    }
});

export default Api;