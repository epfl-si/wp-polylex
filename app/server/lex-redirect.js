import {
  Lexes
} from "../imports/api/collections.js"

// Global API configuration
let LexRedirect = new Restivus({
  apiPath: '/lex',
  useDefaultAuth: false
});

// Maps to:
// - /lex/:id, e.g. https://polylex-admin.epfl.ch/lex/1.0.1
LexRedirect.addRoute(
  ":id", {
    authRequired: false
  }, {
    get: function() {
      let lex = Lexes.findOne({ // Let's assume the lex is not abrogated
        isAbrogated: {$ne: true},
        lex: this.urlParams.id
      }) ?? Lexes.findOne({ // If no lex found, let's try with an abrogated one
        isAbrogated: true,
        lex: this.urlParams.id
      })

      if (lex && lex.urlFr) {
        return {
          statusCode: 302,
          headers: {
            'Content-Type': 'text/plain',
            'Location': lex.urlFr
          },
          body: `Location: ${lex.urlFr}`
        }
      }

      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
        body: 'Lex not found!'
      }
    }
  }
)

export default LexRedirect;
