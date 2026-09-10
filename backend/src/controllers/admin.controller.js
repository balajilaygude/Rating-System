const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const bcrypt = require("bcryptjs");

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      password,
      role,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role: role || "USER",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      sortOrder = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (name) {
      filter.name = {
        $regex: name,
        $options: "i",
      };
    }

    if (email) {
      filter.email = {
        $regex: email,
        $options: "i",
      };
    }

    if (address) {
      filter.address = {
        $regex: address,
        $options: "i",
      };
    }

    if (role) {
      filter.role = role;
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(
      Math.max(Number(limit), 1),
      100
    );

    const sort = {
      [sortBy]: sortOrder === "desc" ? -1 : 1,
    };

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password")
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let store = null;

    if (user.role === "STORE_OWNER") {
      store = await Store.findOne({
        owner: user._id,
      });
    }

    res.json({
      user,
      store,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user",
      error: error.message,
    });
  }
};
const createStore = async (req, res) => {
  console.log(req.body)
  try {
    const {
      name,
      email,
      address,
      owner,
    } = req.body;

    const ownerUser = await User.findById(owner);

    if (!ownerUser) {
      return res.status(404).json({
        message: "Store owner not found",
      });
    }

    if (ownerUser.role !== "STORE_OWNER") {
      return res.status(400).json({
        message:
          "Selected user is not a store owner",
      });
    }

    const existingStore = await Store.findOne({
      owner,
    });

    if (existingStore) {
      return res.status(400).json({
        message:
          "This store owner already has a store",
      });
    }

    const store = await Store.create({
      name,
      email,
      address,
      owner,
      averageRating: 0,
      totalRatings: 0,
    });

    const populatedStore =
      await Store.findById(store._id).populate(
        "owner",
        "name email"
      );

    res.status(201).json({
      message: "Store created successfully",
      store: populatedStore,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create store",
      error: error.message,
    });
  }
};

const getStores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
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
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const sort = {
      [sortBy]:
        sortOrder === "asc" ? 1 : -1,
    };

    const [stores, total] = await Promise.all([
      Store.find(query)
        .populate("owner", "name email")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),

      Store.countDocuments(query),
    ]);

    res.json({
      stores,
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

module.exports = {
  getDashboard,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
};