const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if the username exists in the users array
    return users.some(user => user.username === username);
  };

// Check if the username and password match the records
const authenticatedUser = (username, password) => {
    // Check if there is a user with the given username and password
    return users.some(user => user.username === username && user.password === password);
  };

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (!isValid(username)) {
      return res.status(401).json({ message: "Invalid username." });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate JWT token
  const accessToken = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });

  return res.status(200).json({ message: "Login successful.", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
