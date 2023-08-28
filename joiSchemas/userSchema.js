import Joi from "joi";

const joiUserSchema = Joi.object({
	fullName: Joi.string().min(3).max(30).required().messages({
		'string.base': 'Name should be a valid string',
		'any.required': 'Password is required',
		'string.max': 'Username should have at most 30 characters',
	}),
	email: Joi.string().email().required().messages({
		'string.base': 'Email should be a valid string',
		'string.email': 'Email should be a valid email address',
		'any.required': 'Email is required',
	  }),
	profileImg: Joi.string().valid('image/jpeg', 'image/png').messages({
		'any.only': 'Profile image format should be either JPEG or PNG',
	  }),
	password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
		'string.base': 'Password should be a valid string',
		'string.pattern.base': 'Password should only contain letters and numbers',
		'any.required': 'Password is required',
	  }),
});

export default joiUserSchema;
