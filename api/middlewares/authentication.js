const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportJwt = require("passport-jwt");
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const { User: User } = require("../models");

function passwordsMatch(submittedPassword, storedPassword) {
	return bcrypt.compareSync(submittedPassword, storedPassword);
}

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		(email, password, done) => {
			User.findOne({ where: { email } })
				.then((user) => {
					if (!user) {
						console.log(
							"\n\nFailed Login: user does not exist\n\n"
						);
						return done(null, false, { message: "Failed Login" });
					}
					if (
						passwordsMatch(password, user.Password_Hash) === false
					) {
						console.log(
							"\n\nFailed Login: password did not match\n\n"
						);
						return done(null, false, { message: "Failed Login" });
					}

					console.log("\n\nSuccessful Login\n\n");
					return done(null, user, {
						message: "Successful Logged In!",
					});
				})
				.catch((error) => {
					return done(error);
				});
		}
	)
);

const jwtDecodeOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SESSION_SECRET,
};

passport.use(
	new JwtStrategy(jwtDecodeOptions, (payload, done) => {
		return done(null, payload.data);
	})
);

passport.serializeUser((user, done) => {
	done(null, user.User_Id);
});

passport.deserializeUser((id, done) => {
	User.findByPk(id)
		.then((user) => {
			if (!user) {
				done(null, false);
				return;
			}

			done(null, user);
			return;
		})
		.catch((error) => done(error, null));
});

passport.isAuthenticated = () => (req, res, next) =>
	req.user ? next() : res.sendStatus(401);

module.exports = passport;
