
import SimpleSchema from 'simpl-schema';

export function throwMeteorError(fieldName, message) {
    const ddpError = new Meteor.Error(message);
    ddpError.error = 'validation-error';
    ddpError.details = [{name: fieldName, message: message}];
    throw ddpError;
}

export default SimpleSchema.defineValidationErrorTransform(error => {
    const ddpError = new Meteor.Error(error.message);
    ddpError.error = 'validation-error';
    ddpError.details = error.details;
    return ddpError;
});
