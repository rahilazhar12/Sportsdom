const Userschema = require('../Models/user.model');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const UserRegistration = async (req, res) => {
    try {
        const { name, email, password, contact, role } = req.body;

        // Basic validation
        if (!name || !email || !password || !contact) {
            return res.status(400).send({ message: "Please fill all the fields." });
        }

        // Check existing email in both User and PNY Alumni schemas
        const checkUser = await Userschema.findOne({ email });


        if (checkUser) {
            return res.status(400).send({ message: "Email already exists in our records." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Userschema({
            name,
            email,
            password: hashedPassword,
            role,
            contact,
        });
        const result = await newUser.save();
        if (result) {
            return res.status(201).send({ message: "User registered successfully", role, email });
        }

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).send({ message: "Failed to register user." });
    }
}

const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Attempt to find the user in both schemas
        const user = await Userschema.findOne({ email });

        // Check if a user was found and if the password is correct
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const isPasswordCorrect =  bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Generate a token
        const token = JWT.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_KEY,
            { expiresIn: '7d' }
        );

        // Respond with login success
        res.status(200).json({
            Message: "Login Success",
            _id: user._id,
            username: user.name,
            email: user.email,
            token: token,
            role: user.role,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { UserRegistration, UserLogin }
