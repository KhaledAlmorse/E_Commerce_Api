const mongoose = require("mongoose");

//1_create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand Required"],
      unique: [true, "Brand must unique"],
      minlength: [3, "Too Short Brand name"],
      maxlength: [32, "Too long Brand name"],
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post("init", (doc) => {
  //return image base url + image name
  setImageURL(doc);
});
brandSchema.post("save", (doc) => {
  //return image base url + image name
  setImageURL(doc);
});

//2-create model
const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
