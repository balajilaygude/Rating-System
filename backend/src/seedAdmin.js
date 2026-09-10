require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../src/models/User");
const Store = require("../src/models/Store");
const Rating = require("../src/models/Rating");

const seedData = async () => {
  try {
    // ==========================================
    // CONNECT TO MONGODB
    // ==========================================

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // ==========================================
    // CLEAR OLD DATA
    // ==========================================

    console.log("Clearing old data...");

    await Rating.deleteMany({});
    await Store.deleteMany({});
    await User.deleteMany({});

    console.log("Old data cleared");

    // ==========================================
    // CREATE PASSWORD HASHES
    // ==========================================

    const adminPassword = await bcrypt.hash("Admin@123", 12);
    const ownerPassword = await bcrypt.hash("Owner@123", 12);
    const userPassword = await bcrypt.hash("User@123", 12);

    // ==========================================
    // 1. CREATE ADMIN
    // ==========================================

    const admin = await User.create({
      name: "System Administrator Account",
      email: "admin@example.com",
      password: adminPassword,
      address: "Admin Office, Pune, Maharashtra",
      role: "ADMIN",
    });

    console.log("1 Admin created");

    // ==========================================
    // 2. CREATE 8 STORE OWNERS
    // ==========================================

    const ownerData = [
      {
        name: "Rahul Sharma Store Owner",
        email: "rahul.owner@example.com",
        address: "Kothrud, Pune, Maharashtra",
      },
      {
        name: "Priya Mehta Store Owner",
        email: "priya.owner@example.com",
        address: "Baner, Pune, Maharashtra",
      },
      {
        name: "Amit Patil Store Owner",
        email: "amit.owner@example.com",
        address: "Wakad, Pune, Maharashtra",
      },
      {
        name: "Sneha Joshi Store Owner",
        email: "sneha.owner@example.com",
        address: "Viman Nagar, Pune, Maharashtra",
      },
      {
        name: "Rohan Kulkarni Store Owner",
        email: "rohan.owner@example.com",
        address: "Hinjewadi, Pune, Maharashtra",
      },
      {
        name: "Neha Deshmukh Store Owner",
        email: "neha.owner@example.com",
        address: "Aundh, Pune, Maharashtra",
      },
      {
        name: "Vikram Jadhav Store Owner",
        email: "vikram.owner@example.com",
        address: "Hadapsar, Pune, Maharashtra",
      },
      {
        name: "Anjali More Store Owner",
        email: "anjali.owner@example.com",
        address: "Kharadi, Pune, Maharashtra",
      },
    ];

    const owners = await User.insertMany(
      ownerData.map((owner) => ({
        ...owner,
        password: ownerPassword,
        role: "STORE_OWNER",
      }))
    );

    console.log(`${owners.length} Store Owners created`);

    // ==========================================
    // 3. CREATE 20 NORMAL USERS
    // ==========================================

    const userData = [
      {
        name: "John Doe Normal User",
        email: "john@example.com",
        address: "123 Main Street, Pune, Maharashtra",
      },
      {
        name: "Aarav Sharma Customer Account",
        email: "aarav@example.com",
        address: "Kothrud, Pune, Maharashtra",
      },
      {
        name: "Ishita Patel Customer Account",
        email: "ishita@example.com",
        address: "Baner, Pune, Maharashtra",
      },
      {
        name: "Aditya Kumar Customer Account",
        email: "aditya@example.com",
        address: "Wakad, Pune, Maharashtra",
      },
      {
        name: "Ananya Singh Customer Account",
        email: "ananya@example.com",
        address: "Aundh, Pune, Maharashtra",
      },
      {
        name: "Arjun Verma Customer Account",
        email: "arjun@example.com",
        address: "Hadapsar, Pune, Maharashtra",
      },
      {
        name: "Kavya Deshmukh Customer",
        email: "kavya@example.com",
        address: "Kharadi, Pune, Maharashtra",
      },
      {
        name: "Riya Joshi Customer Account",
        email: "riya@example.com",
        address: "Viman Nagar, Pune, Maharashtra",
      },
      {
        name: "Siddharth Patil Customer",
        email: "siddharth@example.com",
        address: "Hinjewadi, Pune, Maharashtra",
      },
      {
        name: "Meera Kulkarni Customer",
        email: "meera@example.com",
        address: "Shivajinagar, Pune, Maharashtra",
      },
      {
        name: "Vivek Jadhav Customer Account",
        email: "vivek@example.com",
        address: "Magarpatta, Pune, Maharashtra",
      },
      {
        name: "Pooja More Customer Account",
        email: "pooja@example.com",
        address: "Koregaon Park, Pune, Maharashtra",
      },
      {
        name: "Karan Shah Customer Account",
        email: "karan@example.com",
        address: "Pimpri, Pune, Maharashtra",
      },
      {
        name: "Tanvi Agarwal Customer",
        email: "tanvi@example.com",
        address: "Chinchwad, Pune, Maharashtra",
      },
      {
        name: "Nikhil Gupta Customer Account",
        email: "nikhil@example.com",
        address: "Camp, Pune, Maharashtra",
      },
      {
        name: "Simran Kaur Customer Account",
        email: "simran@example.com",
        address: "Pashan, Pune, Maharashtra",
      },
      {
        name: "Manish Joshi Customer Account",
        email: "manish@example.com",
        address: "Wagholi, Pune, Maharashtra",
      },
      {
        name: "Divya Nair Customer Account",
        email: "divya@example.com",
        address: "Yerawada, Pune, Maharashtra",
      },
      {
        name: "Harsh Vora Customer Account",
        email: "harsh@example.com",
        address: "Lohegaon, Pune, Maharashtra",
      },
      {
        name: "Snehal Pawar Customer Account",
        email: "snehal@example.com",
        address: "Dhanori, Pune, Maharashtra",
      },
    ];

    const users = await User.insertMany(
      userData.map((user) => ({
        ...user,
        password: userPassword,
        role: "USER",
      }))
    );

    console.log(`${users.length} Normal Users created`);

    // ==========================================
    // 4. CREATE 10 STORES
    // ==========================================

    const storeData = [
      {
        name: "Fresh Mart Grocery Store Pune",
        email: "freshmart@example.com",
        address: "Kothrud Main Road, Pune, Maharashtra",
        owner: owners[0]._id,
      },
      {
        name: "Green Valley Supermarket Pune",
        email: "greenvalley@example.com",
        address: "Baner Road, Pune, Maharashtra",
        owner: owners[1]._id,
      },
      {
        name: "Daily Needs Shopping Store Pune",
        email: "dailyneeds@example.com",
        address: "Wakad Main Road, Pune, Maharashtra",
        owner: owners[2]._id,
      },
      {
        name: "Urban Basket Grocery Store Pune",
        email: "urbanbasket@example.com",
        address: "Viman Nagar, Pune, Maharashtra",
        owner: owners[3]._id,
      },
      {
        name: "Family Choice Super Store Pune",
        email: "familychoice@example.com",
        address: "Hinjewadi Phase One, Pune, Maharashtra",
        owner: owners[4]._id,
      },
      {
        name: "Happy Shopping Grocery Store Pune",
        email: "happyshopping@example.com",
        address: "Aundh Road, Pune, Maharashtra",
        owner: owners[5]._id,
      },
      {
        name: "Value Plus General Store Pune",
        email: "valueplus@example.com",
        address: "Hadapsar Main Road, Pune, Maharashtra",
        owner: owners[6]._id,
      },
      {
        name: "Royal Fresh Supermarket Pune",
        email: "royalfresh@example.com",
        address: "Kharadi Main Road, Pune, Maharashtra",
        owner: owners[7]._id,
      },
      {
        name: "Smart Choice Grocery Store Pune",
        email: "smartchoice@example.com",
        address: "Shivajinagar, Pune, Maharashtra",
        owner: owners[0]._id,
      },
      {
        name: "Premium Daily Shopping Pune",
        email: "premiumdaily@example.com",
        address: "Koregaon Park, Pune, Maharashtra",
        owner: owners[1]._id,
      },
    ];

    const stores = await Store.insertMany(
      storeData.map((store) => ({
        ...store,
        averageRating: 0,
        totalRatings: 0,
      }))
    );

    console.log(`${stores.length} Stores created`);

    // ==========================================
    // 5. CREATE UNIQUE RATINGS
    // ==========================================

    /*
      IMPORTANT:

      There are 20 users and 10 stores.

      User 0  -> Store 0
      User 1  -> Store 1
      User 2  -> Store 2
      ...
      User 9  -> Store 9

      User 10 -> Store 0
      User 11 -> Store 1
      ...
      User 19 -> Store 9

      Therefore NO user rates the same store twice.
    */

    const ratingValues = [
      5,
      4,
      3,
      5,
      4,
      5,
      4,
      5,
      3,
      4,
      4,
      5,
      4,
      3,
      5,
      4,
      5,
      3,
      4,
      5,
    ];

    const ratings = [];

    for (let i = 0; i < users.length; i++) {
      const storeIndex = i % stores.length;

      ratings.push({
        store: stores[storeIndex]._id,
        user: users[i]._id,
        rating: ratingValues[i],
      });
    }

    await Rating.insertMany(ratings);

    console.log(`${ratings.length} Ratings created`);

    // ==========================================
    // 6. CALCULATE STORE RATINGS
    // ==========================================

    for (const store of stores) {
      const storeRatings = await Rating.find({
        store: store._id,
      });

      if (storeRatings.length === 0) {
        await Store.findByIdAndUpdate(store._id, {
          averageRating: 0,
          totalRatings: 0,
        });

        continue;
      }

      const totalRating = storeRatings.reduce(
        (sum, item) => sum + item.rating,
        0
      );

      const averageRating =
        totalRating / storeRatings.length;

      await Store.findByIdAndUpdate(store._id, {
        averageRating:
          Math.round(averageRating * 10) / 10,

        totalRatings: storeRatings.length,
      });
    }

    console.log("Store ratings calculated");

    // ==========================================
    // 7. SHOW CREATED DATA
    // ==========================================

    console.log("");
    console.log("==========================================");
    console.log("             SEED SUCCESSFUL");
    console.log("==========================================");

    console.log("");
    console.log("Admin        :", 1);
    console.log("Store Owners :", owners.length);
    console.log("Users        :", users.length);
    console.log("Stores       :", stores.length);
    console.log("Ratings      :", ratings.length);

    console.log("");
    console.log("==========================================");
    console.log("             LOGIN DETAILS");
    console.log("==========================================");

    console.log("");
    console.log("ADMIN");
    console.log("------------------------------------------");
    console.log("Email    : admin@example.com");
    console.log("Password : Admin@123");

    console.log("");
    console.log("STORE OWNER");
    console.log("------------------------------------------");
    console.log("Email    : rahul.owner@example.com");
    console.log("Password : Owner@123");

    console.log("");
    console.log("NORMAL USER");
    console.log("------------------------------------------");
    console.log("Email    : john@example.com");
    console.log("Password : User@123");

    console.log("");
    console.log("==========================================");

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("==========================================");
    console.error("              SEED FAILED");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================");

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedData();
