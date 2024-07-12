const express = require('express');
const cors = require('cors');
const router = require('./Routes/routes.js');
require ("dotenv").config();
require("./DataBase/Connection");


const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use('/uploads', express.static("./uploads"))
app.use('/files', express.static("./public/files"))

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});