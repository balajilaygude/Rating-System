const Store = require("../models/Store");
const Rating = require("../models/Rating");

const getStores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          address: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const sort = {
      [sortBy]:
        sortOrder === "asc" ? 1 : -1,
    };

    const [stores, total] =
      await Promise.all([
        Store.find(query)
          .populate(
            "owner",
            "name email"
          )
          .sort(sort)
          .skip(skip)
          .limit(Number(limit)),

        Store.countDocuments(query),
      ]);

    const storeIds = stores.map(
      (store) => store._id
    );

    const ratings =
      await Rating.find({
        store: {
          $in: storeIds,
        },
        user: req.user.id,
      });

    const ratingMap = {};

    ratings.forEach((rating) => {
      ratingMap[
        rating.store.toString()
      ] = rating.rating;
    });

    const formattedStores =
      stores.map((store) => ({
        ...store.toObject(),

        userRating:
          ratingMap[
            store._id.toString()
          ] || 0,
      }));

    res.json({
      stores: formattedStores,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(
        total / Number(limit)
      ),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get stores",
      error: error.message,
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store =
      await Store.findById(req.params.id)
        .populate(
          "owner",
          "name email"
        );

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const rating =
      await Rating.findOne({
        store: store._id,
        user: req.user.id,
      });

    res.json({
      store,
      userRating: rating
        ? rating.rating
        : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get store",
      error: error.message,
    });
  }
};

module.exports = {
  getStores,
  getStoreById,
};