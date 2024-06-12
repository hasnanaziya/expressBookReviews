const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// This contains the skeletal implementations for the routes which
// a general user can access.


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
        users.push({"username": username , "password": password});
        return res.status(200).json({message : "User succesfully registered! Please login to continue."});
    } else {
        return res.status(404).json({message : "User already exists!"});
    }
  }
  return res.status(404).json({message : "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // code for getting the list of books available in the shop 
  res.send(JSON.stringify(books,null,4))
 });


 // Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(book){
      return res.status(200).send(JSON.stringify(books[isbn],null,4));
    }
    else{
      return res.status(404).json({message: "Book not found."});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const booksArray = Object.values(books);
   const author = req.params.author.toLowerCase().trim();
   let foundAuthor = booksArray.filter((book) => book.author.toLowerCase().trim() === author);
   if(foundAuthor.length > 0){
    res.json(foundAuthor[0]);
   } else{
    res.status(404).json({message:"No books by the Author found"});
}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const booksArray = Object.values(books);
    const title = req.params.title.toLowerCase().trim();
    let foundTitle = booksArray.filter((book) => book.title.toLowerCase().trim() === title);
    if(foundTitle.length > 0){
     res.json(foundTitle[0]);
    } else{
     res.status(404).json({message:"Book not found"});
 }
});

//  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//     const booksArray = Object.values(books);  // Convert books object to an array
//     const isbn = req.params.isbn;
//     let foundBook = booksArray.filter((book) => book.isbn === isbn);
//     const reviews = req.params.reviews;
//     //let foundReviews= booksArray.filter((book) => book.reviews === reviews);
//     if(foundBook){
//         if(foundBook.reviews && (foundBook.reviews).length > 0){
//             res.json(foundBook.reviews); // Assuming there's only one book with that ISBN
//         } else{
//             res.status(404).json({message:"No reviews found for this book"});
//         }
//     } else {
//         res.status(404).json({message:"Book not found"});
//     }
// });

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let foundBook = null;

    for (const bookId in books) {
      if (books[bookId].isbn === isbn) {
        foundBook = books[bookId];
        break;
      }
    }
  
    if (foundBook) {
      if (foundBook.reviews && Object.keys(foundBook.reviews).length > 0) {
        res.json(foundBook.reviews); // Send all reviews for the book
      } else {
        res.status(404).json({ message: "No reviews found for this book!" }); // Send error response
      }
    } else {
      res.status(404).json({ message: "Book not found!" }); // Send error response if book not found
    }
  });


const axios = require('axios');

  //get list of books using async-await with Axios
const getBookList = async (url) => {
    try {
        const response = await axios.get(url);
        const bookList = response.data;
        console.log(bookList);
    } catch (error) {
        console.error(error.toString());
    }
}

console.log("Before connect URL");
getBookList('http://localhost:5000/');
console.log("After connect URL");

//getting the book details based on ISBN
const getBookISBN = (url) => {
    const req = axios.get(url);
    console.log(req);
    req.then(resp => {
        let book = resp.data;
        console.log(book);
    })
        .catch(err => {
            console.log(err.toString())
        });
    }    
console.log("Before connect URL");
getBookISBN('http://localhost:5000/isbn/1');
console.log("After connect URL");
    
//getting the book details based on author
const getBookFromAuthor = (url) => {
    const req = axios.get(url);
    console.log(req);
    req.then( resp => {
        let book =  resp.data;
        console.log(book);
    })
    .catch(err => {
        console.log(err.toString())
    });
}
console.log("Before connect URL");
getBookFromAuthor('http://localhost:5000/author/Jane Austen');
console.log("After connect URL");


//getting the book details based on Title
const getBookFromTitle = (url) =>{
    const req =  axios.get(url);
    console.log(req);
    req.then(resp => {
        let book = resp.data;
        console.log(book);
    })
    .catch(err => {
        console.log(err.toString())
    });
}
console.log("Before connect URL");
getBookFromTitle('http://localhost:5000/title/Fairy tales');
console.log("After connect URL");

module.exports.general = public_users;
