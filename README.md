# API-REST-Guide

<p align="center">
  <img src="https://github.com/Suareguen/API-REST-Guide/blob/main/images/logoReboot.png" alt="Logo Reboot">
</p>

Pequeña guía de como debemos afrontar la creación de una API REST para una red social al estilo de la antigua Twitter. Tendremos cuatro modelos (entidades o tablas) en nuestra API que serán las de: usuario, tweets, informacion de contacto del usuario (contactInfo) y tags. Al disponer de 4 modelos de inicio podemos definir que tendremos 4 controladores y 4 rutas asociadas a cada uno de los modelos. En caso de tener mas modelos o menos ajustaríamos ese numero, para 3 modelos tres controladores y 3 rutas, etc. Esto sería establecido de inicio a no ser que se especificase lo contrario al inicio del proyecto, ya cada proyecto tiene su propio contexto, objetivos y metodologías, pero podemos decir que en nuestro caso al tener 4 modelos disponemos de 4 rutas y 4 controladores.

## **Index**

  - [Inicio de proyecto](#Inicio-de-proyecto)
    - [Estructura de proyecto](#Estructura-de-proyecto)
    - [Iniciar servidor con Express JS](#Iniciar-servidor-con-Express-JS)
    - [Conexión a la base de datos](#Conexión-a-la-base-de-datos)
  - [Creación de modelos](#Creación-de-modelos)
    - [Definición de modelos](#Definición-de-modelos)
    - [Sincronización de modelos en la BBDD](#Sincronización-de-modelos-en-la-BBDD)
  - [Creación de controladores y rutas correspondientes](#Creación-de-controladores-y-rutas-correspondientes)
    - [Rutas](#Rutas)
    - [Ejemplos peticiones del CRUD por Postman](#Ejemplos-peticiones-del-CRUD-por-Postman)
  - [Relations](#Relations)
  - [Login y SignUp](#Login-y-SignUp)
  - [Middlewares](#Middlewares)
    - [Middleware de autenticación](#Middleware-de-autenticación)
    - [Verificación de rol](#Verificación-de-rol)

## Inicio de proyecto

**IMPORTANTE:** tener en cuenta que si nos clonamos el proyecto deberemos directamente entrar a la carpeta de nuestro proyecto una vez se nos clone y ejectar ```npm install``` para que se nos instlen todos los paquetes, es decir, cuando entren a su proyecto el comando anterior lo ejecutan cuando ustedes al ejecutar el comando ```ls``` les muestre el ```package.json```, esa la ruta donde ejecutaremos el comando. 

### Estructura de proyecto

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
  "license": "ISC"
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

- Importamos ```express```, creamos su instancia ```app``` y nos importamos ```cors``` y ```morgan``` añadiendo al archivo:
  ```js
  const express = require('express')
  const app = express()
  const cors = require('cors')
  const morgan = require('morgan')
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

```bash
node --watch index.js
Restarting 'index.js'
Server started
```

Ya tenemos nuestro servidor a la escucha!!!!

### Conexión a la base de datos

Para ello primero en el archivo ```index.js``` de la carpeta **database** creamos la conexión a la base de datos, a través de la instacia de ```Sequelize``` que importamos del paquete que ya hemos instalado y deberíamos tener algo como esto:

**IMPORTANTE:** En Table Plus crear la base de datos antes de realizar la conxión a la base de datos.

```js
// Importamos Sequelize desde el módulo sequelize, que es necesario para crear la conexión con la base de datos
const { Sequelize } = require('sequelize');

// Creamos una nueva instancia de Sequelize para manejar la conexión con una base de datos MySQL, es decir, establecemos las credenciales y demás opciones necesarias para la conexión
const connection = new Sequelize('nombreDeLaBasedeDatos', 'usuario', 'contraseña', {
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

```js
const { Sequelize } = require('sequelize');

const connection = new Sequelize('nombreDeLaBasedeDatos', 'usuario', 'contraseña', {
  host: 'localhost', // Dirección del servidor de la base de datos
  dialect: 'mysql', // Especificamos que usaremos MySQL como el sistema de gestión de base de datos
  port: 3306,       // Puerto por el que se conecta al servidor MySQL, 3306 es el predeterminado para MySQL
  logging: false    // Desactivamos el logging para no mostrar los detalles de las consultas SQL en la consola
});

const checkDb = async () => {
  try {
    await connection.authenticate()
    console.log('Connection to DB succesfull')
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  checkDb,
  connection
}
```

Para finalizar nos quedaría ir a nuestro archivo ```index.js``` principal, nos importamos las funciones que acabamos de crear y creamos una función ```checkAndSyncMySQL``` para realizar nuestra conexión a la base de datos de una manera más unificada (esto de cara a futuro) y deberíamos tener algo así:

```js
const {
  connection,
  checkDb
} = require('./database/index.js')

async function checkAndSyncMySQL() {
    try {
          await checkDb()
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

Y si todo va bien deberíamos tener ya la conexión con la base de datos hecha, simplemente al arrancar el servidor debería mostrarnos esto:

```bash
node --watch index.js
Restarting 'index.js'
Connection to DB succesfull
Server started
```

## Creación de modelos

### Definición de modelos

En este apartado pasaremos a crear los 4 modelos que especificamos al inicio del proyecto que serán: user, comments, tweets y contactInfo.

Para ello en la carpeta de ```models``` creada anteriormente creamos el archivo ```user.model.js``` y dentro del mismo tendríamos algo como esto:

```js
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
module.exports = User
```

El resto de modelos siguiendo la misma estructura deberían quedarnos algo así:

**Tweet**

```js
const { DataTypes } = require('sequelize')
const { connection } = require('../../database/index')


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

**Tag**

```js
const { DataTypes } = require('sequelize')
const { connection } = require('../../database/index')

const Tag = connection.define('tag', {
  name: {
    type: DataTypes.STRING,
  }
},
  {
    timestamps: false
  }
)

module.exports = Tag
```

**ContactInfo**

```js
const { DataTypes } = require('sequelize')
const { connection } = require('../../database/index')


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

### Sincronización de modelos en la BBDD

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
const Tweet = require('../api/models/tweet.model.js')
const ContactInfo = require('../api/models/contactInfo.model.js')
const Tag = require('../api/models/tag.model.js')

const initializeRelations = () => {
  try {
    //here the relations
    console.log('Relations added to models')
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

![https://myoctocat.com/assets/images/base-octocat.svg](https://github.com/Suareguen/API-REST-Guide/blob/main/images/serverStarted.png)

```bash
Connection to DB succesfull
Models added
Server started
```
Y además si abrimos Table Plus deberían aparecernos las tablas ya definidas en nuestra base de datos de esta manera:

![https://github.com/Suareguen/API-REST-Guide/blob/main/images/serverStarted.png](https://github.com/Suareguen/API-REST-Guide/blob/main/images/tableplus.png)

## Creación de controladores y rutas correspondientes

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

Por ahora el segundo parámetro que pasamos al método ```get``` es una función callback añadida directamente, pero la idea es crear ahora en el controlador de usuario una función que ejcutemos en vez de esta que me hemos escrito directamente.

Por ello ahroa iremos al ```user.controller.js``` y en el mismo creamos la siguiente función:

```js
const User = require('../models/user.model.js')

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
  getAllUsers
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

**NOTA:** ¿Cómo podemos saber cual es la rta para acceder a nuestro recurso?
En nuestro caso con la última línea que hemos añadido ```app.use('/api', require('./api/routes/index'))``` nos da la entrada a nuestro router que en nuestro caso al trabajar en local siempre empezará así (cuando tengamos la API deployada este inicio de ruta cabiará pero nos a proporciona el servicio que usemos para subir nuestra API): ```http://localhost:3000``` y la continuación de nuestra ruta la especificamos antes que sería ```api``` quedándonos la ruta por ahora así: ``` http://localhost:3000/api```, ahora nos falta ir a nuestro ```index.s```de la carpeta de router dentro de ```api``` y ver las rutas de las que disponemos, en nuestro caso solo tenemos ```user``` por ahora así que nos quedaría la siguiente ruta: ```http://localhost:3000/api/user```.
Ahora bien si vamos a nuestro ```user.router.js``` tenemos una ruta únicamente y la especifico como una string vacía ```""```, esto nos dice que esa ruta termina sin añadir nada, en caso de no tener una string vacía y tuviésemos ```"users"``` nuestra ruta sería: ```http://localhost:3000/api/user/users```, pero como no es así nos quedamos con: ```http://localhost:3000/api/user```.

Ya tendríamos una ruta hecha para obtener todos los usuarios de nuestra página, nos quedaría implementra el resto del CRUD y nos debería quedar algo así:

**user.controller.js**

```js
const User = require('../models/user.model.js')

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
      name: req.body.name,
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
Una vez que hayamos finalizado de crear todos los controladores y las rutas asociadas a cada uno de ellos a podemos pasar  establecer las relaciones existentes en nuestra Base de Datos. Para comprobar si esta bien en este proyecto ya disponemos dle proyecto completo con los controladores hechos al completo.

### Ejemplos peticiones del CRUD por Postman

**getAllUsers**

```
http://localhost:3000/api/user
```

![https://github.com/Suareguen/API-REST-Guide/blob/main/images/tableplus.png](https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/getAllUsers.png)
**getOneUser**

```
http://localhost:3000/api/user/1
```

![https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/getAllUsers.png](https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/getOneUser.png)

**createUser**

```
http://localhost:3000/api/user
```

![https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/getAllUsers.png](https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/createUser.png)

**updateUser**

```
http://localhost:3000/api/user/1
```

![https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/getAllUsers.png](https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/updateUser.png)

**deleteUser**

```
http://localhost:3000/api/user/1
```

![https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/getAllUsers.png](https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/deleteUser.png)

## Relations

Ahora procederemos a crear las relaciones entre nuestros modelos (tablas o entidades). Para ello iremos al archivo ```relations.js``` y en la función que especificamos ```initializeRelations``` establecemos las relaciones.

**IMPORTANTE:** VAMOS A TENER UNA RELACIÓN DE CADA TIPO.

Primero antes que nada vamos a definir dichas relaciones, en nuestro caso vamos a tener:

   - One to One: entre ```User``` y ```ContactInfo```, ya que un usuario va a tener una única información de contacto y dicha información de contacto pertenece a un usuario únicamente.

  ```js
    User.hasOne(ContactInfo)
    ContactInfo.belongsTo(User)
  ```

   - One to Many: entre ```User``` y ```Tweet```, ya que un usuario va a tener muchos tweets pero cada tweet va  apertenecer a solo un usuario.

  ```js
    User.hasMany(Tweet)
    Tweet.belongsTo(User)
  ```

   - Many to Many: entre ```Tweet``` y ```Tag```, ya que un tweet va a poder tener muchos tags y cada tag va a poder pertenecer a muchos tweets.

  ```js
    Tweet.belongsToMany(Tag, { through: 'tweet_tag' })
    Tag.belongsToMany(Tweet, { through: 'tweet_tag' })
  ```


Se nos quedaría el archivo así:

```js
const User = require('../api/models/user.model.js')
const Tweet = require('../api/models/tweet.model.js')
const ContactInfo = require('../api/models/contactInfo.model.js')
const Tag = require('../api/models/tag.model.js')

const initializeRelations = () => {
  try {
    //here the relations

    // One to One
    User.hasOne(ContactInfo)
    ContactInfo.belongsTo(User)

    // One to Many
    User.hasMany(Tweet)
    Tweet.belongsTo(User)

    // Many to Many

    Tweet.belongsToMany(Tag, { through: 'tweet_tag' })
    Tag.belongsToMany(Tweet, { through: 'tweet_tag' })
    console.log('Relations added to models')
  } catch (error) {
    console.log(error)
  }
}

module.exports = initializeRelations
```

## Login y SignUp

Pasamos a crear nuestras funciones de registro y login en nuestra API, para ello en nuestra carpeta ```controllers``` creamos un archivo ```auth.controller.js```.

Una vezen dcho archivo pasamos a crear nuestra función de ```SignUp```, posteriormente pasaremos a la creación del ```Login```.


```js
// Importamos los modelos de usuario y contacto
const User = require('../models/user.model');
const Contact = require('../models/contactInfo.model');

// Importamos las librerías para manejar tokens y cifrado de contraseñas
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Definimos la función signUp, que será una función asincrónica para manejar la creación de usuarios
const signUp = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: {
        email: req.body.email
      }
    })

    if(existingUser) {
      return res.status(409)json({ messae: 'User already exits'})
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
    await contact.setUser(user);

    // Creamos el payload del token, incluyendo el email del usuario
    const payload = { email: req.body.email };
    // Firmamos el token con una clave secreta y establecemos un tiempo de expiración
    const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });

    // Si todo es correcto, devolvemos el token al usuario con un estado 200 (OK)
    return res.status(200).json({ token });  // === { token: token }
  } catch (error) {
    // Si hay un error, lo registramos y devolvemos un error 500 (Error interno del servidor)
    console.log('Error signing up user');
    return res.status(500).json(error);
  }
}

// Exportamos la función signUp para que pueda ser utilizada en otros archivos
module.exports = {
  signUp
}
```


Ahora que tenemos nuestro SignUp vamos a necesitar una ruta para poder ejecutar dicha función y acceder al recurso que necesitamos, en este caso necesitamos acceder al usuario para comprobar que existe el usuario en nuestra BBDD y en caso de que exita no registrar al mismo usuario varias veces.

Vamos a nuestra carpeta ```routes``` y en nuestro ```index.js``` añadimos la siguiente ruta:

```js
router.use('auth', require('./auth.router.js'))
```

y nos quedaría así el ```index.js```:

```js
// Importamos el módulo de enrutamiento de Express y creamos un enrutador.
const router = require('express').Router();

// Usamos el enrutador para manejar todas las peticiones dirigidas a '/user' usando el enrutador definido en 'user.router'.
router.use('/user', require('./user.router'))
router.use('auth', require('./auth.router.js'))

// Exportamos el enrutador para que pueda ser utilizado por otros archivos en nuestra aplicación.
module.exports = router;
```



Una vez hecho esto creamos en la misma carpeta ```routes``` un archivo ```auth.router.js```, lo abrimos y creamos la ruta perteneciente a este ```signUp```.

Nos debería quedar algo así:

```js
const router = require('express').Router()
const { signUp } = require('../controllers/auh.controller.js')

router.post('/signup', signUp)

module.exports = router
```
Pasamo a crear el ```login``` una vez que tenemos el registro hecho.

```js
// Definición de la función 'login' que es asincrónica para manejar peticiones de inicio de sesión
const login = async (req, res) => {
  try {
    // Intenta encontrar un usuario en la base de datos que coincida con el email proporcionado
    const user = await User.findOne({
      where: {
        email: req.body.email // El email viene del cuerpo de la petición
      }
    });

    // Si no se encuentra un usuario con el email proporcionado, devuelve un error 404
    if (!user) {
      return res.status(404).send('Email or password wrong'); // Mensaje de error indicando que el email o contraseña son incorrectos
    }

    // Utiliza bcrypt para comparar la contraseña proporcionada con la almacenada en la base de datos
    const checkPass = bcrypt.compareSync(req.body.password, user.password);

    // Si la contraseña es correcta
    if (checkPass) {
      // Crea un payload con el email del usuario
      const payload = { email: req.body.email };
      // Firma un token JWT usando una clave secreta y establece un tiempo de expiración
      const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });
      // Devuelve el token generado con un estado 200, indicando éxito en el inicio de sesión
      return res.status(200).json({ token }); // El objeto json contiene el token generado
    } else {
      // Si la contraseña no es correcta, devuelve un error 404
      return res.status(404).send('Email or password wrong'); // Mensaje de error similar al anterior
    }

  } catch (error) {
    // En caso de un error durante el proceso, registra el error y devuelve un estado 500
    console.log('Error logging in'); // Mensaje de error en consola
    return res.status(500).json(error); // Devuelve el error capturado como respuesta JSON
  }
}
```

Nos quedaría exportalo a final del archivo junto al ```signUp```:

```js
module.exports = {
  signUp,
  login
};
```
De la misma manera que hicimos con el ```signUp``` tenemos que crear la ruta que accederá a este recurso quedándonos algo así:

```js
const router = require('express').Router()
const { signUp, login } = require('../controllers/auh.controller.js')

router.post('/signup', signUp)
router.post('/login', login)

module.exports = router
```

Quedándonos las siguiente rutas (endpoints) para acceder a estos registros que serían:

**SignUp**

```http://localhost:3000/api/auth/signUp```

En el apartado ```Body``` seleccionamos la opción ```raw``` y en el desplegable de la derecha elegimos el formato ```JSON```, aquí es donde introduciremos los valores que el usuario va a registrar, como en nuestro caso en el modelo (tabla o entidad) de ```User``` tenemos los atributos o campos a rellenar de: name, email y password.

Deberíamos tener algo así:

![https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/deleteUser.png](https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/signup.png)

**Login**

```http://localhost:3000/api/auth/login```

Siguiendo los mismos pasos que en el apartado anterior de la misma manera probamos nuestro ```login```solo que esta vez no pasaremo el parámetro ```name```, quedándonos algo así:

![https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/signup.png](https://github.com/Suareguen/API-REST-Guide/blob/main/images/Postman/login.png)

## Middlewares

### Middleware de autenticación

A continuación, implementaremos medidas de seguridad en nuestras rutas para controlar el acceso a los recursos de la API. Específicamente, estableceremos middlewares que requerirán que los usuarios estén autenticados para acceder a ciertos recursos. Esto significa que solo los usuarios que hayan iniciado sesión y posean un token válido podrán realizar ciertas operaciones. Los usuarios que no dispongan de un token válido verán restringido su acceso, asegurando así que solo usuarios autorizados puedan interactuar con la API de formas específicas.

Para ello creamos dentro de la carpeta ```middlewares``` un archivo ```auth.js```, lo abrimos y pasamos a crear una función ```checkAuth``` que verificara si el usuario tiene ```token``` y en caso de que lo tuviese nos dejaria acceder al recurso quedándonos algo así:

```js
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

module.exports = {
  checkAuth
}
```

Ahora vamos a proteger en nuestra carpeta ```routes``` las rutas del usuario, para ello vamos al archivo ```user.router.js```, importamos el ```checkAuth``` y lo aplicamos en las rutas quedándonos algo así:

```js
const router = require('express').Router()
const { getAllUsers, getOneUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller.js')
const { checkAuth } = require('../middlewares/auth.js')

// Añadimos nuestro middleware antes de que se ejecute nuestro controlador, si todo va bien podremos acceder a nuestro recurso, em caso contrario no nos dejará
router.get('/', checkAuth, getAllUsers)
router.get('/:id', checkAuth, getOneUser)
router.post('/', checkAuth, createUser)
router.put('/:id', checkAuth, updateUser)
router.delete('/:id', checkAuth, deleteUser)

module.exports = router
```

### Verificación de rol

Vamos a nuestro arcico ```auth.js``` y añadimos una función más que se llamará ```checkAdmin``` y nos comprobará si el rol del usuario es de ```admin```, protegiendo así las rutas a las que solo puedan acceder los administradores, quedándonos una función así:

```js
function checkAdmin(req, res, next) {
  if (res.locals.user.role !== 'admin') {
    return res.status(401).json('Admins only')
  }
  else {
    next()
  }
}
```

E importamos el archivo al final teniendo algo así:

```js
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
```

Vamos otra vez a la ruta del usuario donde implementamos el ```checkAuth``` y lo aplicamos justo después teniendo algo así:

```js
const router = require('express').Router()
const { getAllUsers, getOneUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller.js')
const { checkAuth, checkAdmin } = require('../middlewares/auth.js')

// Añadimos nuestro middleware después del checkAuth, ahora la ruta en la que aplicamos el checkAdmin comprobará primero si el usuario tiene token (tiene que estar logeado) y después comprueba si su rol en la Base de Datos es el de Admin en caso de serlo puede acceder a esa recurso si no tienes ese rol si podrás.
router.get('/', checkAuth, checkAdmin, getAllUsers)
router.get('/:id', checkAuth, getOneUser)
router.post('/', checkAuth, createUser)
router.put('/:id', checkAuth, updateUser)
router.delete('/:id', checkAuth, deleteUser)

module.exports = router
```
Con esto sería todo para nuestra API, en el código lo tienen todo implementado., la idea es que lo vayan haciendo ustedes y echándole un ojo al repositorio en caso de que sea necesario.
