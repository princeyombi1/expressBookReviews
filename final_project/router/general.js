const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({username: username, password: password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(400).json({message: "User already exists!"});
    }
  } else {
    return res.status(400).json({message: "Unable to register user."});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
    try {
      const response = await new Promise((resolve, reject) => {
        if (books) {
          resolve({data: books});
        } else {
          reject("No books available");
        }
      });
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({message: error});
    }
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN


// Route pour obtenir les détails d’un livre par ISBN (Promesse)
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Simuler un appel asynchrone avec Axios (ici on appelle notre propre API)
  axios.get("http://localhost:5000/")
    .then(response => {
      const allBooks = response.data;
      const book = allBooks[isbn];
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
    });
});

module.exports = public_users;

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const filterBooksAuthor = Object.values(books).filter((book) => book.author === author);
  if (filterBooksAuthor.length >0) {
    return res.status(200).json(filterBooksAuthor);
  }else {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const filterBooksTitle = Object.values(books).filter((book) => book.title === title);
  if (filterBooksTitle.length >0) {
    return res.status(200).json(filterBooksTitle);
  }else {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }else { 
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
