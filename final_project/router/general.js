const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.use(express.json());

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Validate request
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
  
    // Check if the username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }
  
    // Add new user to the users array
    users.push({ username, password });
  
    return res.status(201).json({ message: 'User registered successfully' });
  });


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books))
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  return res.send(JSON.stringify(books[isbn]))
//   return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  return res.send(JSON.stringify(books[author]))
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.author
  return res.send(JSON.stringify(books.title))
//   return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const reviews = req.params.reviews
  return res.send(JSON.stringify(books.reviews))
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
