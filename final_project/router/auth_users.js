const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const reg_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

// Tarea 7 y Pregunta 8: Iniciar sesión
reg_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Customer successfully logged in" });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Tarea 8 y Pregunta 9: Agregar/Modificar reseña
reg_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization['username'];

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

// Tarea 9 y Pregunta 10: Eliminar reseña
reg_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization['username'];

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).send(`La reseña para el ISBN ${isbn} publicada por el usuario ${username} ha sido eliminada.`);
    } else {
      return res.status(404).json({ message: "Reseña no encontrada para este usuario." });
    }
  } else {
    return res.status(404).json({ message: "Libro no encontrado." });
  }
});

module.exports.authenticated = reg_users;
module.exports.isValid = isValid;
module.exports.users = users;