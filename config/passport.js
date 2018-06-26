var passport = require("passport");
var User = require("../models/user");
var LocalStrategy = require("passport-local").Strategy;

//The basic idea about serialization and deserialization is, when a user is authenticated,
//Passport will save the user’s _id property to the session as req.session.passport.user.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
//The reason why we don’t save the entire user object in session are: 1. Reduce the size of
//the session; 2. It’s much safer to not save all the user information in the session in case of misuse
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// local.signup used to create a new user

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      req
        .checkBody("email", "Invalid email")
        .notEmpty()
        .isEmail();
      req
        .checkBody("password", "Invalid password")
        .notEmpty()
        .isLength({ min: 4 });

      var errors = req.validationErrors();
      if (errors) {
        var messages = [];
        errors.forEach(function(error) {
          messages.push(error.msg);
        });
        return done(null, false, req.flash("error", messages));
      }
      //find a user with  this email.
      User.findOne({ email: email }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          //null because no errors.
          // false, because no object retrieved
          return done(null, false, { message: "Email is already in use." });
        }

        //NEW  user saved here
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        });
      });
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      req
        .checkBody("email", "Invalid email")
        .notEmpty()
        .isEmail();
      req.checkBody("password", "Invalid password").notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        var messages = [];
        errors.forEach(function(error) {
          messages.push(error.msg);
        });
        return done(null, false, req.flash("error", messages));
      }
      User.findOne({ email: email }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "No user found" });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Wong password" });
        }

        return done(null, user);
      });
    }
  )
);
