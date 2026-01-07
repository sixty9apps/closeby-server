// const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
// const config = require('./config');
// const { tokenTypes } = require('./tokens');
// const { User } = require('../models');

// This file has been intentionally left blank for future implementation of passport strategies when User authentication is needed.
// Below is a sample JWT strategy implementation that can be adapted for Book model if needed in the future.

// const jwtOptions = {
//   secretOrKey: config.jwt.secret,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// };

// const jwtVerify = async (payload, done) => {
//   try {
//     if (payload.type !== tokenTypes.ACCESS) {
//       throw new Error('Invalid token type');
//     }
//     const user = await User.findById(payload.sub);
//     if (!user) {
//       return done(null, false);
//     }
//     done(null, user);
//   } catch (error) {
//     done(error, false);
//   }
// };

// const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

// module.exports = {
//   jwtStrategy,
// };
