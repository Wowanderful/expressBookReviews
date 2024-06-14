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

// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ message: "Access token is missing or invalid." });
    }
  
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token." });
      }
  
      req.user = user;
      next();
    });
  };

// Add or modify a book review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const { username } = req.user;
  
    if (!isbn || !review) {
      return res.status(400).json({ message: "ISBN and review are required." });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    // Add or modify the review for the book with the given ISBN
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/updated successfully." });
  });

 // Delete a book review
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const { username } = req.user;
  
    if (!isbn) {
      return res.status(400).json({ message: "ISBN is required." });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review not found." });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
