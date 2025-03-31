import Joi from "joi";

//TODO make all email small caps

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    stock: Joi.number().required(),
    image: Joi.string().required()
  }),
};

const getAProduct = {
  params: Joi.object().keys({
    id: Joi.string().required()
  }),
};

export default {
  createProduct,
  getAProduct, 
};