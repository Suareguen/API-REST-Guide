# API-REST-Guide

Pequeña guía de como debemos afrontar la creación de una API REST para una red social al estilo de la antigua Twitter. Tendremos tres modelos (entidades o tablas) en nuestra API que serán las de: usuario, tweets, informacion de contacto del usuario (contactInfo) y comentarios. Al disponer de 4 modelos de inicio podemos definir que tendremos 4 controladores y 4 rutas asociadas a cada uno de los modelos. En caso de tener mas modelos o menos ajustaríamos ese numero, para 3 modelos tres controladores y 3 rutas, etc. Esto sería establecido de inicio a no ser que se especificase lo contrario al inicio del proyecto, ya cada proyecto tiene su propio contexto, objetivos y metodologías, pero podemos decir que en nuestro caso al tener 4 modelos disponemos de 4 rutas y 4 controladores.

**Añadir ```.gitignre```**

## **Index**


  - [Inicio de proyecto](#Inicio-de-proyecto)
  - [Creación de modelos](#Creación-de-modelos)


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

Una vez hemos añadido dicha función volvemos a arrancar nuestro servidor por medio de ```node --watch index.js```.
Debería salirnos por consola algo asi:

![consola](/home/suarenguen/code/API-REST-Guide/images/serverStarted.png)
