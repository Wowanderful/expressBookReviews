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
public_users.get('/', (req, res) => {
    new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("No books available");
      }
    })
    .then((bookList) => {
      res.status(200).json(bookList);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
  
    new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    })
    .then((bookDetails) => {
      res.status(200).json(bookDetails);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
  });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;
  
    new Promise((resolve, reject) => {
      const bookList = [];
      for (let isbn in books) {
        if (books[isbn].author === author) {
          bookList.push(books[isbn]);
        }
      }
      if (bookList.length > 0) {
        resolve(bookList);
      } else {
        reject("No books found for the given author");
      }
    })
    .then((booksByAuthor) => {
      res.status(200).json(booksByAuthor);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
  });

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;
  
    new Promise((resolve, reject) => {
      const bookList = [];
      for (let isbn in books) {
        if (books[isbn].title === title) {
          bookList.push(books[isbn]);
        }
      }
      if (bookList.length > 0) {
        resolve(bookList);
      } else {
        reject("No books found with the given title");
      }
    })
    .then((booksByTitle) => {
      res.status(200).json(booksByTitle);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const reviews = req.params.reviews
  return res.send(JSON.stringify(books.reviews))
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
