const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

//This contains the skeletal implementations 
//for the routes which an authorized user can access.

let users = [];

const isValid = (username) =>  { //returns boolean
  let userwithsamename = users.filter((user) => {
    return user.username === username
});
    if(userwithsamename.length > 0){
        return true;
    } else{
        return false;
    }
}

const authenticatedUser = (username,password) => { //returns boolean
    let validUsers = users.filter((user) =>{
        return (user.username === username && user.password === password)
    });
        if(validUsers.length > 0){
            return true;
        }else{
            return false;
        }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
}); 

// // Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//     const isbn = req.params.isbn;
//     const review = req.query.review;
//     const username = req.session.authorization.username;

//     if (!review) {
//       return res.status(400).json({ message: 'No review has been submitted' });
//     }

//     // Check if the book exists in the database
//     if (!books[isbn]) {
//         return res.status(404).json({ message: `book with ISBN ${isbn} does not exist` });
//     }

//     // Check if the user has already reviewed the book
//     if (books[isbn].reviews[username]) {
//         // If the user has already reviewed the book, modify the existing review
//         books[isbn].reviews[username] = review;
//         return res.status(200).json({ message: `Review updated for book with ISBN ${isbn} by ${username}` });
//     } else {
//         // If the user has not reviewed the book, add a new review
//         books[isbn].reviews[username] = review;
//         return res.status(201).json({ message: `New Review added for book with ISBN ${isbn} by user ${username}` });
//     }
// });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let filtered_book = books[isbn];
    if (filtered_book) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        
        if(review) {
            filtered_book['reviews'][reviewer] = review;
            books[isbn] = filtered_book;
        } else {
            return res.send("review is empty");
        }
        res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
  });



regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviewer = req.session.authorization['username'];
    let filtered_review = books[isbn]["reviews"];
    if (filtered_review[reviewer]){
        delete filtered_review[reviewer];
        res.send(`Reviews for the ISBN  ${isbn} posted by the user ${reviewer} deleted.`);
    }
    else{
        res.send("Can't delete, as this review has been posted by a different user");
    }
    });  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
