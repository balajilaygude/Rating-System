const Rating = require("../models/Rating");
const Store = require("../models/Store");


const updateStoreRating = async (storeId) => {
  const result = await Rating.aggregate([
    {
      $match: {
        store: storeId,
      },
    },
    {
      $group: {
        _id: "$store",
        averageRating: {
          $avg: "$rating",
        },
        totalRatings: {
          $sum: 1,
        },
      },
    },
  ]);

  if (result.length === 0) {
    await Store.findByIdAndUpdate(storeId, {
      averageRating: 0,
      totalRatings: 0,
    });

    return;
  }

  await Store.findByIdAndUpdate(storeId, {
    averageRating:
      Math.round(
        result[0].averageRating * 10
      ) / 10,

    totalRatings:
      result[0].totalRatings,
  });
};

const submitRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { storeId } = req.params;

    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const existingRating = await Rating.findOne({
      store: storeId,
      user: req.user.userId,
    });

    if (existingRating) {
      return res.status(409).json({
        success: false,
        message:
          "You have already rated this store. Use update instead.",
      });
    }

    await Rating.create({
      store: storeId,
      user: req.user.userId,
      rating,
    });

    await updateStoreRating(store._id);

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { storeId } = req.params;

    const existingRating = await Rating.findOne({
      store: storeId,
      user: req.user.userId,
    });

    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: "You have not rated this store yet",
      });
    }

    existingRating.rating = rating;

    await existingRating.save();

    await updateStoreRating(storeId);

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;

    const ratings = await Rating.find({
      store: storeId,
    })
      .populate("user", "name email address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({
      owner: req.user.userId,
    });

    if (!store) {
      return res.status(404).json({
        message:
          "No store found for this owner",
      });
    }

    const ratings = await Rating.find({
      store: store._id,
    })
      .populate(
        "user",
        "name email address"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      store,
      ratings,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to load owner dashboard",
      error: error.message,
    });
  }
};


module.exports = {
  submitRating,
  updateRating,
  getStoreRatings,
  getOwnerDashboard,
};