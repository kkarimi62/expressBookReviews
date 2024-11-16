const express      = require('express');
let books          = require("./booksdb.js");
let isValid        = require("./auth_users.js").isValid;
let users          = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', (req, res)=> {
  const methCall = new Promise((resolve, reject)=>{
    setTimeout(()=>{
      try{
        let myBooks = books;
        resolve(myBooks);
      } catch(err){
        reject(err);
      };
    },3000)});
  methCall.then((myBooks)=>{res.status(300).send(JSON.stringify({myBooks},null,4));},
                (err)=>{res.status(404).json({message: "Unable to send book list!"})});
  });


// public_users.get('/',function (req, res) {
//   res.status(300).send(JSON.stringify({books},null,4));
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const methCall = new Promise((resolve, reject)=>{
    setTimeout(()=>{
      try{
        let isbn = req.params.isbn;
        let bookArrayByISBN = [];
        for(let key in books){
          if(books[ key ].isbn === isbn){
            bookArrayByISBN.push(books[ key ]);
          };
        };
        resolve(bookArrayByISBN);
      }catch(err){
        reject(err);
      };
    },3000)});

    methCall.then((bookArrayByISBN)=>{res.status(300).send(JSON.stringify({bookArrayByISBN},null,4));},
                  (err)=>{res.status(404).json({message: "Unable to send book details based on ISBN!"})}); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const methCall = new Promise((resolve, reject)=>{setTimeout(()=>{
    try{
      let author = req.params.author;

      let bookArrayByAuthor = [];
      for(let key in books){
        if(books[ key ].author === author){
          bookArrayByAuthor.push(books[ key ]);
        };
      };
      resolve(bookArrayByAuthor);
    } catch(err){
      reject(err);
    };

    methCall.then((bookArrayByAuthor)=>{res.status(300).send(JSON.stringify({bookArrayByAuthor},null,4))},
                  (err)=>{res.status(404).json({message: "Unable to send book details based on author!"})});
  },3000)});
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const methCall = new Promise((resolve, reject)=>{setTimeout(()=>{
    try{
      let title = req.params.title;
      let bookArrayByTitle = [];
      for(let key in books){
        if(books[ key ].title === title){
          bookArrayByTitle.push(books[ key ]);
        };
      };
      resolve(bookArrayByTitle);
    } catch(err){
      reject(err);
    };

    methCall.then((bookArrayByTitle)=>{res.status(300).send(JSON.stringify({bookArrayByTitle},null,4))},
                  (err)=>{res.status(404).json({message: "Unable to send book details based on title!"})});
  },3000)});
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  let bookReviewByISBN = [];
  for(let key in books){
    if(books[ key ].isbn === isbn){
      bookReviewByISBN.push(books[ key ].reviews);
    };
  };


  return res.status(300).send(JSON.stringify({bookReviewByISBN},null,4));
});

module.exports.general = public_users;
