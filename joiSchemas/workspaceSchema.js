import Joi from "joi";

const joiWorkspaceSchema = Joi.object({
  name:Joi.string().required().messages({
		'string.base': 'Workspace name should be a valid string',
		'any.required': 'Workspace name is required',
	  }),
  
  
});

export default joiWorkspaceSchema;
