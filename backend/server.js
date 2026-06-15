require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks",taskRoutes);

app.get("/", (req, res) => {
    res.send("Task Manager API Running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});