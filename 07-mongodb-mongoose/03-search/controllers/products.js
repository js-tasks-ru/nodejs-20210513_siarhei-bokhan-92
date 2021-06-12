const Product = require("../models/Product");

const toClient = data => {
	const {_id: id, __v, ...rest} = data;
	return {...rest, id};
};

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.request.query.query;

  if (!query) ctx.throw(501); 

  const products = await Product.find( { $text: { $search: query } } ).lean();

  ctx.body = {
    products: products.map(toClient),
  };
};
