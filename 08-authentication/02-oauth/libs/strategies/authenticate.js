const User = require("../../models/User");

module.exports = async function authenticate(strategy, email, displayName, done) {
	try {
		if (!email) return done(null, false, "Не указан email");

		const user = await User.findOne({email});

		if (user) return done(null, user);

		const newUser = new User({
			email,
			displayName,
		});

		await newUser.validate();
		await newUser.save();

		done(null, newUser);
	} catch (error) {
		done(error);
	}
};
