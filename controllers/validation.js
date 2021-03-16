/**
 * A module to run JSON Schema based validation on request/response data.
 * @module controllers/validation
 * @author Demanou henri INSPIRE FROM https://github.coventry.ac.uk/6003CEM-2021JANMAY/back_end_demo_code/blob/master/controllers/validation.js
 * @see schemas/* for JSON Schema definition files
 */

 const {Validator, ValidationError} = require('jsonschema');

 userSchema = require('../schemas/users.json').definitions.user
 addAdminSchema =require('../schemas/users.json').definitions.addAmin
 addCenterSchema =require('../schemas/centers.json').definitions.addCenter
 updateCenterSchema =require('../schemas/centers.json').definitions.updateCenter
 userUpdate = require('../schemas/users.json').definitions.userUpdate
 signUpCodeCreateSchema=require('../schemas/signUpcode.json').definitions.signUpcode
 const makeKoaValidator = (schema, resource) => {
    const v = new Validator();
    const validationOptions = {
      throwError: true,
      propertyName: resource
    };
/**
   * Koa middleware handler function to do validation
   * @param {object} cnx - The Koa request/response context object
   * @param {function} next - The Koa next callback
   * @throws {ValidationError} a jsonschema library exception
   */

 const handler = async (cnx, next) => {

    const body = cnx.request.body;

    try {
      v.validate(body, schema, validationOptions);
      await next();
    } catch (error) {
      if (error instanceof ValidationError) {
        cnx.status = 400
        cnx.body = error;
      } else {
        throw error;
      }
    }
  }
  return handler;
}

/** Validate data against user schema for creating new users */
exports.validateUser = makeKoaValidator(userSchema, 'user');
/**Validate adding  user as admin */
exports.ValidateAddAdmin= makeKoaValidator(addAdminSchema,'addAmin')
/** Validate data against user schema for updating users */
exports.validateUpdate = makeKoaValidator(userUpdate, 'userUpdate');
/**Validate data againt sigup schema */
exports.signUpCodeCreate = makeKoaValidator(signUpCodeCreateSchema, 'signUpcode');
/**Validate data againt centers schema */
exports.validateAddCenter = makeKoaValidator(addCenterSchema, 'addCenter');
exports.validateUpdateCenter = makeKoaValidator(addCenterSchema, 'updateCenter');