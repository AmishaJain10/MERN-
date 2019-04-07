const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // to deal with database
const passport = require("passport"); //for protected routes

//load profile and user model
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route GET api/profile/test
//@desc Test profile route
//@access public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

//@route GET api/profile       ....used for current profile of current user
//@des Get current user's profile
//@access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
