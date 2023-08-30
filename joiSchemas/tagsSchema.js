import Joi from "joi";

const joiTagsSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Tag name should be a valid string",
    "any.required": "Tag name is required",
  }),
  user: Joi.string(),
  workspace: Joi.string(),
});

export default joiTagsSchema;
