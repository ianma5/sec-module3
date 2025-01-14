const User = require('../model/User');
const fsPromises = require('fs').promises;
const path = require('path');

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.'})
        // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec(); // needs exec because could pass in a callback (error result)
    if (duplicate) return res.sendStatus(409); // conflict code
    try {
        // encrypt the pssword
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });
        /* this would also work:
        const newUser = new User();
        newUser.username = e
        const result = await newUser.save()
        */
        console.log(result);
        res.status(201).json({ 'message': `New user ${user} created!`})
    } catch (err) {
        res.status(500).json({ 'message': err.message});
    }
}

module.exports = { handleNewUser };