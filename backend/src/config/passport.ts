import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';

const initializeGoogleStrategy = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    console.warn('Google OAuth credentials not found. Google authentication will be disabled.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'), false);
          }

          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              user.isVerified = true;
              await user.save();
            }
            return done(null, user);
          }

          user = await User.create({
            email,
            googleId: profile.id,
            isVerified: true,
          });

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

// Initialize Google strategy
initializeGoogleStrategy();

export default passport;