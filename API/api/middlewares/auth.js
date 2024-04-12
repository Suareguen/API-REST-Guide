const User = require('../models/user.model')
const jwt = require('jsonwebtoken')


function checkAuth(req, res, next) {
  // Verificamos si la petición tiene el encabezado de autorización
  if (!req.headers.authorization) {
    // Si no se encuentra el encabezado de autorización, retorna un error 404
    return res.status(404).send("Token not found");
  }

  // Utilizamos jwt.verify para validar el token proporcionado
  jwt.verify(
    req.headers.authorization, // El token extraído del encabezado de autorización
    process.env.SECRET,        // La clave secreta para desencriptar el token, almacenada en variables de entorno
    async (error, payload) => {  // Callback que maneja el resultado de la verificación
      // Si hay un error en la verificación, como un token expirado o modificado
      if (error) {
        console.log(error.message);  // Imprime el mensaje de error en consola
        // Retorna un error 401 indicando que el token no es válido
        return res.status(401).send("Token not valid");
      }
      // Si el token es válido, busca al usuario correspondiente en la base de datos
      const user = await User.findOne({
        where: {
          email: payload.email, // Utiliza el email contenido en el payload del token para buscar al usuario
        },
      });
      // Si no se encuentra un usuario con ese email, retorna un error 401
      if (!user) {
        return res.status(401).send("Token not valid");
      }
      // Si se encuentra el usuario, lo almacena en el objeto res.locals para su uso en el siguiente middleware
      res.locals.user = user;
      // Llama a la función next para continuar con el próximo middleware en la cadena
      next();
    }
  );
}

function checkAdmin(req, res, next) {
  if (res.locals.user.role !== 'admin') {
    return res.status(401).json('Admins only')
  }
  else {
    next()
  }
}

module.exports = {
  checkAuth,
  checkAdmin
}
