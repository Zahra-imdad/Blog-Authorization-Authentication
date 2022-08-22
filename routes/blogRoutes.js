const express = require("express");
const router = express.Router();

const Blog = require("../model/blogSchema");
const User = require("../model/userSchema");
const app = express();

router.get("/get_all_blog", async (req, res, next) => {
  try {
    const id = req.user.id;
    const blogPosts = await Blog.find({ authorDetail: ic }).populate(
      "authorDetail",
      "-email -password"
    );
    res.json({ blogPosts });
  } catch (error) {
    console.log(error.message);
    next({ status: 500, message: error.message });
  }
});

router.get("/get_all_user", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json({ users });
  } catch (error) {
    console.log(error.message);
    next({ status: 500, message: error.message });
  }
});

router.post("/create_user", async (req, res, next) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  console.log(req.body.name);
  try {
    const user = await User.create({ name, email, password });
    console.log(user);
    res.status(201).json({
      message: "Added user",
      user,
    });
  } catch (e) {
    console.log(error.message);
    next({ status: 500, message: e.message });
  }
});

router.post("/create_blog", async (req, res, next) => {
  const { title, content } = req.body;
  const id = req.user.id;
  console.log(req.body);
  try {
    const blogPost = await Blog.create({ title, content, authorDetail: id });
    console.log(blogPost);
    res.json({ blogPost });
    res.status(201).json({
      message: "Added blog",
      blogPost,
    });
  } catch (e) {
    next({ status: 500, message: e.message });
  }
});

module.exports = router;
