const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { authorise } = require("../middleware/authrise");
const { BlogModel } = require("../model/blog");

const blogRouter = express.Router();

// new blog create
blogRouter.post("/createBlog", auth, authorise(["User"]), async (req, res) => {
  const { blogname, no_of_blogs, blog_Type } = req.body;
  try {
    const data = new BlogModel({
      blogname,
      no_of_blogs,
      blog_Type,
    });
    await data.save();
    res.status(200).send({ msg: "new blog created" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

blogRouter.get("/read", auth, authorise(["User"]), async (req, res) => {
  try {
    const allBlog = await BlogModel.find();
    res.status(200).send(allBlog);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

blogRouter.patch("/update/:id", auth, authorise(["User"]), async (req, res) => {
  const { userid } = req.params.id;
  const payload = req.body;
  try {
    const data = BlogModel.findByIdAndUpdate({ _id: userid }, payload);
    await data.save();
    res.status(200).send({ msg: "Blog is update" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

blogRouter.delete(
  "/delete/:id",
  auth,
  authorise(["User"]),
  async (req, res) => {
    const { userid } = req.params.id;
    try {
      const data = BlogModel.findByIdAndDelete({ _id: userid });
      await data.save();
      res.status(200).send({ msg: "Blog is update" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  }
);

// any blog delete by moderator
blogRouter.delete(
  "/delete/:id",
  authorise(["Moderator"], async (req, res) => {
    const { blogId } = req.params;
    try {
      const data = BlogModel.findByIdAndDelete({ _id: blogId });
      await data.save();
      res.status(200).send({ msg: "Blog is update" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  })
);

module.exports = { blogRouter };
