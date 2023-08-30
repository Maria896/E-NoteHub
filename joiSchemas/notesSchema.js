import Joi from "joi";

const joiNotesSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Notes title should be a valid string",
    "any.required": "Notes title is required",
  }),
  answers: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.base": "Notes Answers should be a valid string",
        "any.required": "Notes answers are required",
      })
    )
    .required(),
  user: Joi.string(),
  workspace: Joi.string(),
  tags:Joi.array()
  .items(
	Joi.string().required().messages({
	  "string.base": "Tags should be a valid string",
	  "any.required": "Tags are required",
	})
  ),
});

export default joiNotesSchema;
