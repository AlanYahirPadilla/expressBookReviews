const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ 
    secret: "fingerprint_customer", 
    resave: true, 
    saveUninitialized: true 
}));

// Middleware de Autenticación
app.use("/customer/auth/*splat", function auth(req, res, next) {
    // Verificar si la sesión contiene datos de autorización
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verificar el token JWT
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Guardar datos del usuario autenticado en el request
                next(); // Permitir el acceso a la siguiente ruta protegida
            } else {
                return res.status(403).json({ message: "Usuario no autenticado / Token inválido" });
            }
        });
    } else {
        return res.status(404).json({ message: "Usuario no ha iniciado sesión" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));