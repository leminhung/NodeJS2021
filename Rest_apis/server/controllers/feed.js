const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    let totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: "Fetch products successfully", posts, totalItems });
  } catch (err) {
    if (!err.statusCode) {
      statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, enter data incorrect!");
    error.statusCode = 422;
    // Nếu throw lỗi ở ngoài then() và catch() thì lỗi sẽ skip đến middleware cuối cùng luôn
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provided!");
    error.statusCode = 422;
    // Nếu throw lỗi ở ngoài then() và catch() thì lỗi sẽ skip đến middleware cuối cùng luôn
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  });
  try {
    await post.save();
    let user = await User.findById(req.userId);
    await user.posts.push(post);
    await user.save();
    res.status(201).json({
      message: "Post created successfully!",
      post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  try {
    if (!post) {
      const err = new Error("Could not find post!");
      err.statusCode = 404;
      // Nếu throw ở trong then() thì lỗi sẽ được nhảy xuống catch luôn
      throw err;
    }
    res.status(200).json({ message: "Get post successfully", post });
  } catch (err) {
    if (!err.statusCode) {
      statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, enter data incorrect!");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const err = new Error("No file picked");
    err.statusCode = 422;
    throw err;
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error("Could not find post!");
      err.statusCode = 404;
      throw err;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorization!");
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const postSave = await post.save();
    res
      .status(200)
      .json({ message: "Post update successfully", post: postSave });
  } catch (err) {
    if (!err.statusCode) {
      statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error("Could not find post!");
      err.statusCode = 404;
      throw err;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorization!");
      error.statusCode = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    const userSave = await user.save();
    res.status(200).json({ message: "Delete successfully", user: userSave });
  } catch (err) {
    if (!err.statusCode) {
      statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    console.log("[err-+]", err);
  });
};
