const { response } = require("express");
const express = require("express");
const router = express.Router();
const TaskTable = require("../../models/taskModel");

// this is post route

router.post("/add", (req, res) => {
  const { title, completed, editing } = req.body;
  add = new TaskTable({
    // id,
    title,
    completed,
    editing,
  });
  add.save().then((data) => res.send(data));
});

// this is get route

router.get("/all", (req, res) => {
  TaskTable.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

//this is put route
router.put("/update/:taskId", async (req, res) => {
  try {
    const task = await TaskTable.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const {
      title = task.title,
      completed = task.completed,
      editing = task.editing,
    } = req.body;

    let TaskDetails = await TaskTable.findByIdAndUpdate(
      task._id,
      { title, completed, editing },
      { new: true }
    );

    res.json(TaskDetails);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});
// this is delete route

router.delete("/:taskId", async (req, res) => {
  try {
    await TaskTable.findOneAndDelete({ _id: req.params.taskId });
    res.json(`Task ${req.params.taskId} deleted`);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
