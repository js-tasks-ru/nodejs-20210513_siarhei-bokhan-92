const Category = require("../models/Category");
const {
	toClient
} = require("../utils");

module.exports.categoryList = async function categoryList(ctx, next) {
	const categories = await Category.find().lean();

	ctx.body = {
		categories: categories.map(category => ({
			...toClient(category),
			subcategories: category.subcategories.map(toClient),
		}))
	};
};
