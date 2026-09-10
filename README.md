# Store Rating System

A full-stack Store Rating System built with **React.js, Tailwind CSS, Express.js, Node.js, and MongoDB**.

The application supports different user roles and provides functionality for managing stores, users, ratings, and store-owner dashboards.

## Note

The original assignment mentioned PostgreSQL/MySQL as the database requirement. I did not have prior experience with PostgreSQL, so I implemented the application using **MongoDB with Mongoose** instead.

I would appreciate it if you could review the implementation, especially the **frontend and backend folders**, and have a look at the overall project structure and implementation.

Also, the current frontend is **not responsive yet**. The UI has currently been designed and tested primarily for **laptop/desktop screen sizes**.

Thank you for taking the time to review my project.

---

# Installation

clone the repo

# Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI="mongodb://127.0.0.1:27017/store-rating-app"
JWT_SECRET='your_super_secret_jwt_key_123"
```

Update the MongoDB connection string if you want to use a different database name or a MongoDB Atlas connection.

Start the backend:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

---

# Seed Database

The project includes seed data for testing.

From the `backend` folder:

```bash
node src/seedData.js
```

The seed creates sample:

* 1 Admin
* 8 Store Owners
* 20 Normal Users
* 10 Stores
* Sample ratings

The seed script also calculates the store rating information.

> Running the seed script clears the existing users, stores, and ratings before inserting the sample data.

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Vite will provide a local URL, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# Important Notes

### Database Choice

The assignment originally specified PostgreSQL/MySQL. Since I had not previously worked with PostgreSQL, I implemented the database layer using **MongoDB and Mongoose**.

The rest of the application architecture follows the assignment requirements as closely as possible.

### Responsive Design

The frontend is currently optimized for **laptop/desktop screens**.

Responsive/mobile support has **not been implemented yet** and would be a future improvement.

---

# Thank You

Thank you for taking the time to review this project.

I would especially appreciate feedback on the **frontend and backend structure, implementation quality, database design, authentication, and overall approach**.

Since MongoDB was used instead of PostgreSQL/MySQL due to my current experience level, feedback on the database design and whether the MongoDB implementation correctly represents the required relationships would also be very helpful.

# Demo Images 

## Admin

<img width="1835" height="955" alt="Screenshot 2026-09-10 131041" src="https://github.com/user-attachments/assets/bb3c7cc4-d04f-470c-81f7-5569bb517756" />

<img width="1835" height="956" alt="Screenshot 2026-09-10 131122" src="https://github.com/user-attachments/assets/67551aaa-702d-4fcf-af5d-5aabe7bc4e32" />

<img width="1833" height="950" alt="Screenshot 2026-09-10 131142" src="https://github.com/user-attachments/assets/f8ba4761-3655-4423-9f6f-4b2103b1db5e" />

## Store Owner

<img width="1831" height="953" alt="Screenshot 2026-09-10 131250" src="https://github.com/user-attachments/assets/7337afc1-5ff1-420c-85f3-e88fb48f4b2a" />

<img width="1832" height="958" alt="Screenshot 2026-09-10 131302" src="https://github.com/user-attachments/assets/5e41edc1-a9c5-4307-9821-5344bf288076" />





