// Importamos DataTypes desde el módulo sequelize para definir tipos de columnas en la base de datos
const { DataTypes } = require('sequelize');

// Importamos el objeto connection desde una ruta relativa, que maneja la conexión con nuestra base de datos
const { connection } = require('../../database/index');

// Definimos un modelo 'User' usando el objeto connection que se refiere a la tabla 'user' en la base de datos
const User = connection.define('user', {
  // Definimos una columna 'name' para almacenar el nombre del usuario
  name: {
    type: DataTypes.STRING // Establece el tipo de dato como cadena de texto
  },
  email: {
    type: DataTypes.STRING // Establece el tipo de dato como cadena de texto
  },
  password: {
    type: DataTypes.STRING // Establece el tipo de dato como cadena de texto
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'), // Establece los roles que puede adoptar el usuario en la aplicación
    defaultValue: 'user' // Por defecto ponemos el valor 'user'
  }
},
  {
    // Configuración adicional para el modelo
    timestamps: false // Desactiva la creación automática de las columnas 'createdAt' y 'updatedAt'
  });

// Exportamos el modelo 'User' para poder usarlo en otras partes de la aplicación
module.exports = User;
