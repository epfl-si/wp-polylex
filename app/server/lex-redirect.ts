import {Lexes} from "/imports/api/collections/lexes";

// Global API configuration
// @ts-ignore
let LexRedirect = new Restivus({
  apiPath: '/lex',
  useDefaultAuth: false
});

// Maps to:
// - /lex/:number, e.g. https://polylex-admin.epfl.ch/lex/1.0.1
// - /lex/:number?type=DOC, e.g. https://polylex-admin.epfl.ch/lex/1.0.1?type=DOC
LexRedirect.addRoute(
  ":number", {
    authRequired: false
  }, {
    get: function() {
      let number = this.urlParams.number
      let type = this.queryParams?.type?.toString().toUpperCase() === "DOC" ? "DOC" : "LEX"

      let lex = Lexes.findOne({ // Let's assume the lex is not abrogated
        isAbrogated: {$ne: true},
        type: type,
        number: number
      }) ?? Lexes.findOne({ // If no lex found, let's try with an abrogated one
        isAbrogated: true,
        type: type,
        number: number
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
        body: `${type} not found!`
      }
    }
  }
)

export default LexRedirect;
