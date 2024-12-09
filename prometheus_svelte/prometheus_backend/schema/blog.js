import { model, Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: String,
    articleSections: Array,
    img: String,
    minRead: Number,
    articleImages: Array,
    comments: Array,
    category: String,
    views: Number
  }, 
  {
    collection: "blog",
    timestamps: { createdAt: "date"},
  }
);

const blogModel = new model('blog', blogSchema)

export default blogModel;
