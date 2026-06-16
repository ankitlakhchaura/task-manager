const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const { createTask,getTasks,updateTask,deleteTask } = require("../controllers/taskController");

router.post("/create", verifyToken,createTask);
router.get("/", verifyToken,getTasks);
router.put("/:id",verifyToken,updateTask);
router.delete("/:id",deleteTask);

module.exports = router;