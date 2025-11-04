/**
 * Missing TypeScript definition to get the project going
 */

declare module '*.svg' {
  const content: string;
  export default content;
}

/**
 * Declare the account package connecting through Entra
 *
 * @see {@link https://github.com/epfl-si/meteor-account-entra}
 */
declare module Meteor {
  function entraSignIn(
    options?: {
      requestPermissions: string[];
    },
    callBack?: (error: any) => void
  ): void
}

declare module 'meteor/maka:rest' {
  interface RouteOptions {
    authRequired?: boolean;
  }

  interface RouteHandler {
    get?: (this: any) => any;
    post?: (this: any) => any;
    put?: (this: any) => any;
    delete?: (this: any) => any;
  }

  interface ApiConfig {
    apiPath?: string;
    prettyJson?: boolean;
    version?: string;
    auth?: {
      loginType?: any;
    };
  }

  class MakaRest {
    constructor(config: ApiConfig);
    addRoute(path: string, options: RouteOptions, handlers: RouteHandler): void;
  }

  export default MakaRest;
}
