# API-REST-Guide

Pequeña guía de como debemos afrontar la creación de una API REST para una red social al estilo de la antigua Twitter. Tendremos tres modelos (entidades o tablas) en nuestra API que serán las de: usuario, tweets, informacion de contacto del usuario (contactInfo) y comentarios. Al disponer de 4 modelos de inicio podemos definir que tendremos 4 controladores y 4 rutas asociadas a cada uno de los modelos. En caso de tener mas modelos o menos ajustaríamos ese numero, para 3 modelos tres controladores y 3 rutas, etc. Esto sería establecido de inicio a no ser que se especificase lo contrario al inicio del proyecto, ya cada proyecto tiene su propio contexto, objetivos y metodologías, pero podemos decir que en nuestro caso al tener 4 modelos disponemos de 4 rutas y 4 controladores.

**Añadir ```.gitignre```**

## **Index**

  - [Inicio de proyecto](#Inicio-de-proyecto)
  - [Creación de modelos](#Creación-de-modelos)
  - [Creación de controladores, CRUD básico y rutas correspondientes](#Creación-de-controladores-,-CRUD-básico,y-rutas-correspondientes)


## Inicio de proyecto

### Instalación package.json, instalación de paquetes y creación de carpetas

Por medio de nuestra terminal accedemos al directorio (carpeta) donde queremos crear el proyecto y por medio del siguiente comando en consola creamos la carpeta donde residirá nuestro proyecto:

```bash
mkdir API-REST
```

Accedemos a ella ahora:
```bash
cd API-REST
```
Ahora una vez que estamos en nuestro proyecto creamos nuestro package.json para poder instalar los pequetes (librerias) que vayamos a usar en nuestro proyecto por medio del siguiente comando estando en la ruta que estamos:

```bash
npm init -y
```
Este comando nos creará el package.json y al poner ```-y``` damos unos valores por defecto que nos debería mostrar algo como esto por consola:

```js
{
  "name": "sequelize-relations",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "morgan": "^1.10.0",
    "mysql2": "^3.9.4",
    "sequelize": "^6.37.2"
  }
}
```

Ahora una vez que ya tenemos nuestro package.json podemos instalar los paquetes (librerias) que vayamos a usar en nuestra aplicación que en nuestro caso serán
: mysql2, sequelize, express, morgan, cors, jsonwebtoken, bcrypt. dichos paquetes los instalamos de la siguente introduciendo en nuestra terminal:

```bash
npm install mysql2 sequelize express morgan cors jsonwebtoken bcrypt
```

Una vez tenemos todo instalado pasamos a crear las carpetas y archivos que vamos a necesitar en nuestro proyecto.

En la ruta que estamos creamos 2 carpetas por medio del siguiente comando en terminal:

```bash
mkdir api database
```

```bash
touch .gitignore
```

Ahora creamos nuestro archivo principal y que será la entrada a nuestra API por medio del siguiente comando:

```bash
touch index.js
```

Ahora entramos a nuestra carpeta ```api``` con el comando ```cd api``` y ahora creamos tres carpetas con los siguientes nombres por medio de la terminal:

```bash
mkdir controllers models routes
```

Ahora volvemos atrás introduciéndolo en la terminal el comando ```cd ..``` y deberíamos estar otra vez en nuestro directorio (carpeta) principal, si hacemos ls deberíamos ver el package.json como uno de los elementos que están en esa carpeta. Una vez hecho esto entramos en la carpeta database con el comando ```cd database``` y aquí creamos dos archivos con el siguiente comando en terminal:

```bash
touch index.js relations.js
```

Ahora volvemos hacia la carpeta anterior por medio del comando ```cd ..``` y ya tendríamos la estructura básica de nuestra API creada, es decir, su esqueleto ahora toca darle vida y funcionalidad.

### Iniciar servidor con Express JS

Abrimos VS Code desde la ruta en la que estábamos anteriormente, es decir, en la ruta principal de nuestra aplicación en donde si hacemos ls deberíamos ver el package.json como uno de los elementos que están en esa carpeta, por medio del comando ```code .```.

Una vez que tenemos abierto nuestro editor de texto procedemos a seleccionar el archivo ```index.js``` (**NO EL DE LA CARPETA database**) e iniciamos la escucha de nuestro servidor de la siguente manera:

- Importamos ```express``` añadiendo al archivo:
  ```js
  const express = require('express')
  ```

- Ahora creamos una función que llamaremos ```initializeAnListenExpress``` en donde crearemos una instacia de express que llamaremos ```app```, aplicaremos los diferentes middlewares como morgan, cors, etc., así como por último la escucha de nuestro servidor en el puerto 3000. Deberíamos tener algo como esto:
  ```js
  const initializeAnListenExpress = () => {
  try {
    app.use(express.json())
      .use(cors())
      .use(morgan('dev'))
      .listen(3000, () => {
      console.log('Server started')
    })
  } catch (error) {
    console.log(error)
  }
  }
  ```
- Posteriormente creamos otra función llamada ```starAPI``` que será la encargada de ejecutar nuestra función anterior para iniciar la escucha de nuestro servidor, deberíamos tener algo como esto:

  ```js
  const startApi = async () => {
  try {
    initializeAnListenExpress()
  } catch (error) {
    console.log(error)
  }
  }

  startApi()
  ```

Aquí por último estamos ejecutando ya ```startAPI```  que nos servirá también para otros procedimientos.

Lo que nos queda es arrancar nuestro servidor por medio del comando ```node --watch index.js``` desde nuestra terminal.
**RECORDATORIO:** ejecutamos desde la ruta principal de nuestra aplicación que es aquella en donde si hacemos ```ls``` deberíamos ver el package.json como uno de los elementos que están en esa carpeta.
Debería aparecernos por consola algo como esto:

Imagen

Ya tenemos nuestro servidor a la escucha!!!!


### Conexión a la base de datos

Para ello primero en el archivo ```index.js``` de la carpeta **database** creamos la conexión a la base de datos, a través de la instacia de ```Sequelize``` que importamos del paquete que ya hemos instalado y deberíamos tener algo como esto:

**IMPORTANTE:** En Table Plus crear la base de datos antes de realizar la conxión a la base de datos.

```js
// Importamos Sequelize desde el módulo sequelize, que es necesario para crear la conexión con la base de datos
const { Sequelize } = require('sequelize');

// Creamos una nueva instancia de Sequelize para manejar la conexión con una base de datos MySQL, es decir, establecemos las credenciales y demás opciones necesarias para la conexión
const connection = new Sequelize('npmbreDeLaBasedeDatos', 'usuario', 'contraseña', {
  host: 'localhost', // Dirección del servidor de la base de datos
  dialect: 'mysql', // Especificamos que usaremos MySQL como el sistema de gestión de base de datos
  port: 3306,       // Puerto por el que se conecta al servidor MySQL, 3306 es el predeterminado para MySQL
  logging: false    // Desactivamos el logging para no mostrar los detalles de las consultas SQL en la consola
});
```

Seguidamente una vez que tenemos la conexión a ka base de datos podemos usar métodos asociados a dicha instacia como el ```authenticate``` para realizar la conexión a la base de datos y autenticación y deberíamos tener algo como esto:

```js
const checkDb = async () => {
  try {
    await connection.authenticate()
    console.log('Connection to DB succesfull')
  } catch (error) {
    console.log(error)
  }
}
```

Solo nos queda importar al final de nuestro archivo la función que hemos creado y la instacia de la conexión con nuestra base de datos de la siguiente manera:

```js
module.exports = {
  checkDb,
  connection
}
```

Y se nos debería quedar una archivo así:

Imagen

Para finalizar nos quedaría ir a nuestro archivo ```index.js``` principal, nos importamos las funciones que acabamos de crear y creamos una función ```checkAndSyncMySQL``` para realizar nuestra conexión a la base de datos de una manera más unificada (esto de cara a futuro) y deberíamos tener algo así:

```js

const {
  connection,
  checkDb,
  syncModels
} = require('./database/index.js')

async function checkAndSyncMySQL() {
    try {
          await checkConnection()
    } catch (error) {
        throw error
    }
}
```
Ejecutamos esta función en la función ```startAPI``` antes de la inicialización de ```express``` y se nos debería quedar así:

```js
const startApi = async () => {
  try {
    await checkAndSyncMySQL()
    initializeExpressAndListen()
  } catch (error) {
    console.log(error)
  }
}
```

Y si todo va bien deberíamos tener ya la conexión con la base de datos hecha.

## Creación de modelos

### Definición de modelos

En este apartado pasaremos a crear los 4 modelos que especificamos al inicio del proyecto que serán: user, comments, tweets y contactInfo.

Para ello en la carpeta de ```models``` creada anteriormente creamos el archivo ```user.model.js``` y dentro del mismo tendríamos algo como esto:

```js
// Importamos DataTypes desde el módulo sequelize para definir tipos de columnas en la base de datos
const { DataTypes } = require('sequelize');

// Importamos el objeto connection desde una ruta relativa, que maneja la conexión con nuestra base de datos
const { connection } = require('../../databse/index');

// Definimos un modelo 'User' usando el objeto connection que se refiere a la tabla 'user' en la base de datos
const User = connection.define('user', {
  // Definimos una columna 'name' para almacenar el nombre del usuario
  name: {
    type: DataTypes.STRING // Establece el tipo de dato como cadena de texto
  }
},
{
  // Configuración adicional para el modelo
  timestamps: false // Desactiva la creación automática de las columnas 'createdAt' y 'updatedAt'
});

// Exportamos el modelo 'User' para poder usarlo en otras partes de la aplicación
module.exports = User;
```

El resto de modelos siguiendo la misma estructura deberían quedarnos algo así:

**Tweet**

```js
const { DataTypes } = require('sequelize')
const { connection } = require('../../databse/index')


const Tweet = connection.define('tweet', {
  comment: {
    type: DataTypes.STRING
  }
},
  {
    timestamps: false
  }
)

module.exports = Tweet
```

**Class**

```js
const { DataTypes } = require('sequelize')
const { connection } = require('../../databse/index')


const Class = connection.define('class', {
  name: {
    type: DataTypes.STRING
  }
},
  {
    timestamps: false
  }
)

module.exports = Class
```

**ContactInfo**

```js
const { DataTypes } = require('sequelize')
const { connection } = require('../../databse/index')


const ContactInfo = connection.define('contactinfo', {
  address: {
    type: DataTypes.STRING
  }
},
  {
    timestamps: false
  }
)

module.exports = ContactInfo
```

### Sincroización de modelos en la BBDD

Una vez que tenemos nuestros modelos ya definido los que nos queda es que los mismos se nos creen en la base de datos, para ello necesitamos volver al achivo ```index.js``` que se encuentra en la carpeta **database**. Una vez que estemos en dicho archivo añadimos la siguiente función que por medio del método ```sync``` podremos sincronizar os modelos con la base de datos. Por lo tanto deberíamos añadir esta función en dicho archivo:

```js
const syncModels = async () => {
  try {
    await connection.sync()
    console.log('Models added')
  } catch (error) {
    console.log(error)
  }
}
```
Anotar los valores de alter y force

Y por último lo exportamos al final del archivo:

```js
module.exports = {
  connection,
  checkDb,
  syncModels
}
```

Ahora vamos al archivo ```index.js```principal, es decir, el que estña en nuestra carpeta raź o principal y en donde antes nos imprtabamos la funcion ```checkDb``` y la instancia ```connection```, añadimos esta nueva función y además la ejecutamos dentro de la función ```checkAndSyncMySQL``` y se nos debería quedar algo así:

```js

const {
  connection,
  checkDb,
  syncModels
} = require('./database/index.js')

async function checkAndSyncMySQL() {
    try {
          await checkConnection()
          await syncModels()
    } catch (error) {
        throw error
    }
}
```

Solo nos quedaría ahora ir al archivo ```relations.js``` y añadir dentro una función que en un futuro nos servirá para hacr las relaciones de nuestras tablas o entidades, por ahora solo nos centraremos en importar a este archivo los modelos que tenemos creados y tendríamos un archivo que tendría la siguiente estrutura:

```js
const User = require('../api/models/user.model.js')
const Tweet = require('../api/models/tweets.model.js')
const ContactInfo = require('../api/models/contact_info.model.js')
const Class = require('../api/models/classes.model.js')
const UserClass = require('../api/models/user_class.model.js')

const initializeRelations = () => {
  try {
    //here the relations
  } catch (error) {
    console.log(error)
  }
}

module.exports = initializeRelations
```
Esta función nos la importamos en nustro ```index.js``` principal de la siguiente manera:

```js
const initializeRelations = require('./database/relations.js')
```

Ahora ejecutamos dicha función en la función ```checkAndSyncMySQL``` y se nos deberia quedar algo así:

```js
async function checkAndSyncMySQL() {
    try {
          await checkConnection()
          initializeRelations()
          await syncModels()
    } catch (error) {
        throw error
    }
}
```
Una vez hemos añadido dicha función volvemos a arrancar nuestro servidor por medio de ```node --watch index.js```.
Debería salirnos por consola algo asi por consola:

![consola con el servidor arrancado y las sincronizaciones hechas](/home/suarenguen/code/API-REST-Guide/images/serverStarted.png)

Y además si abrimos Table Plus deberían aparecernos las tablas ya definidas en nuestra base de datos de esta manera:

Imagen de table plus


## Creación de controladores, CRUD básico y rutas correspondientes

Pasaremos ahora a crear un CRUD básico para nuestro modelo de ```User```, primero vamos a definir una ruta básica hacia nuestro controlador de usuario, para ello dentro de la carpeta ```api``` tendremos la carpeta ```controllers```, en dicha carpeta creamos un archivo ```user.controller.js``` y dentro del mismo antes que nada nos importamos el modelo del usuario de la siguiente manera:

```js
const User = require('../models/user.model.js')
```
 Por ahora solo tendremos esto, vamos a establecer la ruta hacia este controlador y poder manejar las peticiones que hagamos a nuestro recurso (tabla o entidad) en nuestra BBDD.

### Rutas

Nos dirijimos a nuestra carpeta ```routes``` creada dentro de la carpeta ```api``` y en dicha capeta creamos un archivo que se llamará ```index.js```, en dicho archivo lo que haremos será lo siguiente:

```js
// Importamos el módulo de enrutamiento de Express y creamos un enrutador.
const router = require('express').Router();

// Usamos el enrutador para manejar todas las peticiones dirigidas a '/user' usando el enrutador definido en 'user.router'.
router.use('/user', require('./user.router'));

// Exportamos el enrutador para que pueda ser utilizado por otros archivos en nuestra aplicación.
module.exports = router;
```
Una vez que tenemos esto creamos en la misma carpeta un archivo ```user.router.js``` en donde manejaremos las peticiones relacionadas con el usuario.

En nuestro nuevo archivo estableceremos la siguiente estructura:

```js
const router = require('express').Router()

router.get('', (request, response) => {
  console.log('holi')
  return response.status(200).json({ message: 'ete controlador funciona correctamente'})
})

module.exports = router
```

por ahora el segundo parámetro que pasamos al método ```get``` es una función callback añadida directamente, pero la idea es crear ahora en el controlador de usuario una función que ejcutemos en vez de esta que me hemos escrito directamente.

Por ello ahroa iremos al ```user.controller.js``` y en el mismo creamos la siguiente función:

```js
const User = require('../models/user.model')

const getAllUsers = async (request, response) => {
  try {
    const users = await User.findAll()
    return response-status(200).json(users)
  } catch (error) {
    console.log(error)
  }
}

// Exportamos la función que hemos creado

module.exports = {
  getOneUser
}
```

Nos volvemos a nuestro ```user.router.js```, nos importamos la función que acabamos de crear y la añadimos en donde antes teníamos la función callbak que habiamos creado de inicio quedándonos algo así:

```js
const router = require('express').Router()
const { getAllUsers } = require('../controllers/user.controller.js')
router.get('', getAllUsers)

module.exports = router
```

En este apartado para terminar de enrutar nuestra API ecesitamos añadir esto ```app.use('/api', require('./api/routes/index'))``` antes de que nuestro servidor esté a la escucha, es decir, añdirlo a la función ```initializeExpressAndListen``` paa que nos quede algo así:

```js
const initializeExpressAndListen = () => {
  try {
    app.use(express.json())
    app.use('/api', require('./api/routes/index'))
    app.listen(3003, () => {
      console.log('Server started')
    })
  } catch (error) {
    console.log(error)
  }
}
```

Una vez hecho esto podemos probar la ruta ```http://localhost:3000/api/user```en **Postman** y nos debería devolver un array vacío ([]), ya que aún no tenemos ningún dato en nuestra base de datos.

Y nos saldría algoasí en Postamn:

Image de Postman


Ya tendríamos una ruta hecha para obtener todos los usuarios de nuestra página, nos quedaría implementra el resto del CRUD y nos debería quedar algo así:

**user.controller.js**

```js
const User = require('../models/user')

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({ paranoid: false })
    if (users) {
      return res.status(200).json(users)
    } else {
      return res.status(404).send('No users found')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function getOneUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id)
    if (user) {
      return res.status(200).json(user)
    } else {
      return res.status(404).send('User not found')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function createUser(req, res) {
  try {
    const user = await User.create({
      firstName: req.body.firstName,
    })
    return res.status(200).json({ message: 'User created', user: user })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function updateUser(req, res) {
  try {
    const [userExist, user] = await User.update(req.body, {
      returning: true,
      where: {
        id: req.params.id,
      },
    })
    if (userExist !== 0) {
      return res.status(200).json({ message: 'User updated', user: user })
    } else {
      return res.status(404).send('User not found')
    }
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (user) {
      return res.status(200).json('User deleted')
    } else {
      return res.status(404).send('User not found')
    }
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
}
```

Y ahora nestro ```user.router.js``` aplicando lo mismo que hicimos antes pero para el resto de funciones tendríamos esto:

```js
const router = require('express').Router()

const { getAllUsers, getOneUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller.js')

router.get('/', getAllUsers)
router.get('/:id', getOneUser)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router
```

Sería hacer lo mismo pero para las otras entidades de nuestra API.
Una vez que hayamos finalizado de crear todos los controladores y las rutas asociadas a cada uno de ellos a podemos pasar  establecer las relaciones existentes en nuestra Base de Datos.

