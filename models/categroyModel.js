const mongoose = require("mongoose");

//1_create schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Required"],
      unique: [true, "Category must unique"],
      minlength: [3, "Too Short Category name"],
      maxlength: [32, "Too long Category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

CategorySchema.post("init", (doc) => {
  //return image base url + image name
  setImageURL(doc);
});
CategorySchema.post("save ", (doc) => {
  //return image base url + image name
  setImageURL(doc);
});
//2-create model
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
