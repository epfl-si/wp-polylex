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
