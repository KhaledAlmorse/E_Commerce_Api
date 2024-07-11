const ApiError = require("../utils/apiError");
const multer = require("multer");

const multerOptions = () => {
  //1_DiskStorage engine
  // const multerstorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `Category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, filename);
  //   },
  // });
  const multerstorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    // mimetype   image/jpg
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 404));
    }
  };
  const upload = multer({ storage: multerstorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
