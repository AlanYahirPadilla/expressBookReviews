const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tarea 6: Registro de usuario
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Usuario registrado con éxito. Ahora puedes iniciar sesión." });
    } else {
      return res.status(404).json({ message: "El usuario ya existe." });
    }
  }
  return res.status(404).json({ message: "No se pudo registrar al usuario. Revisa los datos." });
});

// Tarea 1 y 10: Obtener la lista de libros (usando Promesas)
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });
  getBooks.then((bks) => {
    res.status(200).send(JSON.stringify(bks, null, 4));
  }).catch((err) => {
    res.status(500).json({ message: "Error al obtener libros" });
  });
});

// Tarea 2 y 11: Obtener detalles del libro basado en ISBN (usando Promesas)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Libro no encontrado");
    }
  });

  getBookByISBN
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// Tarea 3 y 12: Obtener detalles del libro basado en Autor (usando Promesas)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let results = [];
    Object.keys(books).forEach((key) => {
      if (books[key].author === author) {
        results.push(books[key]);
      }
    });
    resolve(results);
  });

  getBooksByAuthor.then((filteredBooks) => {
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  });
});

// Tarea 4 y 13: Obtener detalles del libro basado en Título (usando Promesas)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    let results = [];
    Object.keys(books).forEach((key) => {
      if (books[key].title === title) {
        results.push(books[key]);
      }
    });
    resolve(results);
  });

  getBooksByTitle.then((filteredBooks) => {
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  });
});

// Tarea 5: Obtener reseñas del libro
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
});

module.exports.general = public_users;