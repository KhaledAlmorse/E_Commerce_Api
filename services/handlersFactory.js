const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// exports.deleteOne = (Model) =>
//   asyncHandler(async (req, res, next) => {
//     const { id } = req.params;
//     const document = await Model.findById(id);

//     if (!document) {
//       return next(new ApiError(`No document found for this ID: ${id}`, 404));
//     }

//     await document.remove(); // This triggers the 'remove' middleware

//     res.status(204).send();
//   });
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(new ApiError(`No document found for this ID: ${id}`, 404));
    }
    // This triggers the 'remove' middleware
    await document.deleteOne();

    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new ApiError(`No document For This id ${id}`, 404));
    }
    //tigger "save" event when update document
    document.save();
    res.status(200).json({ data: document });
  });
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model, PopulationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //Build Query
    let query = Model.findById(id);
    if (PopulationOpt) {
      query = query.populate(PopulationOpt);
    }
    //Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document For This id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    //_)Build Query
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filter()
      .search(modelName)
      .limitfields()
      .sort();

    //_)Execute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const document = await mongooseQuery;

    res
      .status(200)
      .json({ result: document.length, paginationResult, data: document });
  });
