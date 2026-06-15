const db = require("../config/db");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users(name,email,password) VALUES(?,?,?)";

        db.query(
            sql,
            [name, email, hashedPassword],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.status(201).json({
                    message: "User Registered Successfully"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const loginUser = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch =
            await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token
        });

    });

};
module.exports = {
    registerUser,loginUser
};