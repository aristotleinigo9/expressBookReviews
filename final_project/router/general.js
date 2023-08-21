const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//for Task 6, Step 2
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

//for Task 6, Step 1
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


// for Task 1
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

//for Task 10
public_users.get('/books',function (req, res) {

  const get_books = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify({books}, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 resolved"));

});


//for Task 2
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN])
 });

//for Task 11
 public_users.get('/books/isbn/:isbn',function (req, res) {
  const get_books_by_isbn = new Promise((resolve, reject) => {
      const ISBN = req.params.isbn;
      resolve(res.send(books[ISBN]));
    })
    get_books_by_isbn.then(() => console.log("Promise for Task 11 resolved"));
 });


 //for Task 3
public_users.get('/author/:author',function (req, res) {
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
      booksbyauthor.push({"isbn":isbn,
                          "title":books[isbn]["title"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({booksbyauthor}, null, 4));
});

//for Task 12
public_users.get('/books/author/:author',function (req, res) {
  const get_books_author = new Promise((resolve, reject) => {
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
      booksbyauthor.push({"isbn":isbn,
                          "title":books[isbn]["title"],
                          "reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
    }


  });
  reject(res.send("The mentioned author does not exist "))
      
  });

  get_books_author.then(function(){
          console.log("Promise for Task 12 is resolved");
  }).catch(function () { 
              console.log('The mentioned author does not exist');
  });

});


//for Task 4
public_users.get('/title/:title',function (req, res) {
  let booksbytitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
      booksbytitle.push({"isbn":isbn,
                          "title": books[isbn]['title'],
                          "author":books[isbn]["author"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({booksbytitle}, null, 4));
});


//for Task 13
public_users.get('/books/title/:title',function (req, res) {

  const get_books_by_title = new Promise((resolve, reject) => {

  let booksbytitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
      booksbytitle.push({"isbn":isbn,
                          "author":books[isbn]["author"],
                          "reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
    }

  });
  reject(res.send("The mentioned title does not exist "))
      
  });

  get_books_by_title.then(function(){
          console.log("Promise for Task 13 is resolved");
  }).catch(function () { 
              console.log('The mentioned title does not exist');
  });

  });

// for Task 5
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])
});


module.exports.general = public_users;
