const Product = require("../models/Product");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
	toClient
} = require("../utils");

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
	const subcategoryID = ctx.request.query.subcategory;

	if (!subcategoryID) return next();
	else if (!ObjectId.isValid(subcategoryID)) ctx.throw(400);

	const products = await Product.find({
		subcategory: ObjectId(subcategoryID)
	}).lean();

	ctx.body = {
		products: products.map(toClient),
	};
};

module.exports.productList = async function productList(ctx, next) {
	const products = await Product.find().lean();

	ctx.body = {
		products: products.map(toClient),
	};
};

module.exports.productById = async function productById(ctx, next) {
	const id = ctx.request.params.id;
	if (!ObjectId.isValid(id)) ctx.throw(400);

	const product = await Product.findById(ObjectId(id)).lean();

	if (!product) ctx.throw(404);

	ctx.body = {
		product: toClient(product),
	};
};
