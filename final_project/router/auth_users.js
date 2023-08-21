const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


//for Task 7, Step 1
const isValid = (username)=>{
      for (var user in public_users) {
        if (user["username"]===username) {
            return true;
        }
      }
      return false;
}

//for Task 7, Step 2
const authenticatedUser = (username,password)=>{ 
    let validuser = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validuser.length > 0){
      return true;
    } else {
      return false;
    }
}


//for Task 7, Step 3
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60});
      req.session.authorization = {accessToken, username}
      return res.status(200).json({message: "User successfully logged in."})
    }
    else {
      return res.status(300).json({message: "Username and password do not match our records. Please try again."});
    }
});


//for Task 8
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          filtered_book['reviews'][reviewer] = review;
          books[isbn] = filtered_book;
      }
      res.send(`The review for the book with ISBN  ${isbn} has been added/updated by a user named ${reviewer}.`);
  }
  else{
      res.send("Unable to find this ISBN!");
  }
});


//for Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  let deleter = req.session.authorization['username'];

  if (!books[isbn]) {
      return res.status(404).send("Unable to find this ISBN!");
  }

  delete books[isbn]['reviews'][deleter];

  return res.status(200).send(`The review for the book with ISBN ${isbn} has been deleted by a user named ${deleter}.`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
