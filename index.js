// Import packages
const express = require("express");
const home = require("./routes/home");
const cors = require('cors');

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/home", home);

// connection
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
