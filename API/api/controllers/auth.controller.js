// Importamos los modelos de usuario y contacto
const User = require('../models/user.model');
const Contact = require('../models/contactInfo.model');

// Importamos las librerías para manejar tokens y cifrado de contraseñas
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Definimos la función signUp, que será una función asincrónica para manejar la creación de usuarios
const signUp = async (req, res) => {
  try {
    //Buscamos al usuario primero para erificar que no se haya registrado antes.
    const findUser = await User.findOne({
      whee: {
        email: req.body.email
      }
    })
    // Si existe el usuario devolvemos un mensaje con que le usuario ya existe y que así no pueda registrase si no que haga login
    if (findUser) {
      return res.json({ messae: 'User already exits' })
    }
    // Generamos una 'sal' para el cifrado de la contraseña. Esto ayuda a asegurar la contraseña aún más
    const salt = bcrypt.genSaltSync(parseInt('10'));
    // Ciframos la contraseña que viene en el cuerpo de la solicitud (req.body.password) usando la 'sal' generada
    req.body.password = bcrypt.hashSync(req.body.password, salt);

    // Creamos un nuevo usuario con los datos proporcionados en la solicitud
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    });

    // Creamos una nueva entrada de contacto con los datos proporcionados
    const contact = await Contact.create({
      address: req.body.address
    });

    // Asociamos el contacto creado con el usuario creado utilizando la función setContact generada por Sequelize
    await user.setContact(contact);

    // Creamos el payload del token, incluyendo el email del usuario
    const payload = { email: req.body.email };
    // Firmamos el token con una clave secreta y establecemos un tiempo de expiración
    const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });

    // Si todo es correcto, devolvemos el token al usuario con un estado 200 (OK)
    return res.status(200).json({ token });  // ===> { token: token }
  } catch (error) {
    // Si hay un error, lo registramos y devolvemos un error 500 (Error interno del servidor)
    console.log('Error signing up user');
    return res.status(500).json(error);
  }
}

// Exportamos la función signUp para que pueda ser utilizada en otros archivos
module.exports = {
  signUp
};
