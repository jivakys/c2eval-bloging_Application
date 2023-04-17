const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    blogname: { type: String, required: true },
    no_of_blogs: { type: Number, required: true },
    blog_Type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const BlogModel = mongoose.model("blog", blogSchema);

module.exports = { BlogModel };
