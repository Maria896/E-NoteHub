import Joi from "joi";

const joiNotesSchema = Joi.object({
  title: Joi.string().required().messages({
		'string.base': 'Notes title should be a valid string',
		'any.required': 'Notes title is required',
	  }),
  answers:Joi.string().required().messages({
		'string.base': 'Notes Answers should be a valid string',
		'any.required': 'Notes answers are required',
	  })
});

export default joiNotesSchema;