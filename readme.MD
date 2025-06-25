<!-- review Markdown (Ctrl+Shift+V) --> 

# 🚀 Node.js + Express + MongoDB (Atlas) Project Setup

This guide covers everything from scratch to a working backend with MongoDB Atlas.

---

## ✅ 1. Install Node.js

Download and install from [https://nodejs.org](https://nodejs.org)
After install, verify:

```bash
node -v
npm -v
```

---

## ✅ 2. Create Project Structure

```bash
mkdir express-app
cd express-app
npm init -y
```

Move your code inside a clean folder structure:

```
express-app/
├── src/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   └── index.js
├── .env
├── .gitignore
├── package.json
```

---

## ✅ 3. Install Base Dependencies

```bash
npm install express mongoose dotenv
```

---

## ✅ 4. Setup MongoDB Atlas

1. Go to: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free shared cluster (M0)
3. Create user and password
4. Whitelist your IP
5. Copy your connection string

---

## ✅ 5. Create `.env` File

At project root:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

Add `.env` to `.gitignore`:

```bash
echo .env >> .gitignore
```

---

## ✅ 6. Configure MongoDB Connection (`src/config/db.js`)

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## ✅ 7. Main App Entry (`src/index.js`)

```js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(express.json());

const userRoutes = require('./routes/user_routes');
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```

---

## ✅ 8. Additional Packages for User Auth (Installed later)

```bash
npm install bcryptjs jsonwebtoken express-validator
```

---

## ✅ 9. Start Server

```bash
npm start
# or if using nodemon
npx nodemon src/index.js
```

---

You now have:

* Node.js backend with Express
* MongoDB Atlas cloud DB
* Environment-based setup
* Ready for user login/signup/token system
