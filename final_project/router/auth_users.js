const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "prince",
    password: "1234"
  }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userfiltered = users.filter((user) => user.username === username);
  if (userfiltered.length >0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let userfiltered = users.filter((user) => user.username === username && user.password === password);
  if (userfiltered.length >0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {username},
      "access",
      {expiresIn: 60 * 60}
    );
    return res.status(200).json({message: "User successfully logged in with token "+accessToken});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  // Récupérer le token dans l'en-tête
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, "access"); // ta clé secrète
    const username = decoded.username;

    const book = books[isbn];
    if (book) {
      if (!book.reviews) book.reviews = {};
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review added/updated successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  // Récupérer le token dans l'en-tête
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(token, "access"); // ta clé secrète
    const username = decoded.username;
    const book = books[isbn];
    if (book && book.reviews && book.reviews[username]) {
      delete book.reviews[username];  
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
