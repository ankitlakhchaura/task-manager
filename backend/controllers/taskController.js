const db = require("../config/db");

const createTask = (req, res) => {

    const { title, description, status, priority, due_date, } = req.body;
    const user_id = req.user.id;

    const sql =
    `INSERT INTO tasks
    (title, description, status, priority, due_date, user_id)
    VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(
        sql,
        [title, description, status, priority, due_date, user_id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Task Created Successfully"
            });
        }
    );
};

const getTasks = (req, res) => {

    const sql = "SELECT * FROM tasks WHERE user_id = ?";

    db.query(sql,[req.user.id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });

};

const updateTask = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE tasks SET status = ? WHERE id = ?";

    db.query(sql, [status, id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            message: "Task Updated Successfully"
        });

    });

};

const deleteTask = (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM tasks WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            message: "Task Deleted Successfully"
        });

    });

};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
