const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//post model
const Post = require("../../models/Post");
//profile model
const Profile = require("../../models/Profile");
//validation
const validatePostInput = require("../../validation/post");

//@route GET api/post/test
//@desc Test post route
//@access public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

//@route get api/posts
//@desc get posts
//@access public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostFound: "No posts found" }));
});

//@route get api/posts/:id
//@desc get post by id
//@access public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostFound: "No post with the given id" })
    );
});
//@route PoST api/posts
//@desc Create post
//@access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      //if any errors,send 400 with errors object
      return res.status(400).json(errors);
    }
    const newPost = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    };
    new Post(newPost).save().then(post => res.json(post));
  }
);

//@route Delete api/posts/:id
//@desc Delete post
//@access private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              notAuthorize: "User is not authorized to delete this post"
            });
          }

          //Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

//@route Post api/posts/like/:id
//@desc Like post
//@access private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.like.filter(l => l.user.toString() === req.user.id).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "user already liked this post" });
          }

          //Add user id to liked array
          post.like.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ error: err, postnotfound: "No post found" })
        );
    });
  }
);

//@route Post api/posts/unlike/:id
//@desc unLike post
//@access private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.like.filter(l => l.user.toString() === req.user.id).length ===
            0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not liked this post" });
          }

          //get remove index
          const removeIndex = post.like
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          //splice out of array
          post.like.splice(removeIndex, 1);

          //save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ error: err, postnotfound: "No post found" })
        );
    });
  }
);

//@route Post api/posts/comment/:id... this id is post id
//@desc Add comment to post
//@access private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      //if any errors,send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //Add to comments array
        post.comments.unshift(newComment);

        //save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//@route Delete api/posts/comment/:id... this id is post id
//@desc Remove comment from post
//@access private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //check if comment exist
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length == 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        //Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        //splice comment out of array
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
