# API-REST-Guide

Pequeña guía de como debemos afrontar la creación de una API REST para una red social al estilo de la antigúa Twitter. Tendremos tres modelos (entidades o tablas) en nuestra API que serán las de: usuario, tweets, informacion de contacto del usuario (contactInfo) y comentarios. Al disponer de 4 modelos de inicio podemos definir que tendremos 4 controladores y 4 rutas asociadas a cada uno de los modelos. En caso de tener mas modelos o menos ajustaríamos ese numero, para 3 modelos tres controladores y 3 rutas, etc. Esto sería establecido de inicio a no ser que se especificase lo contrario al inicio del proyecto, ya cada proyecto tiene su propio contexto, objetivos y metodologías, pero podemos decir que en nuestro caso al tener 4 modelos disponemos de 4 rutas y 4 controladores.


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
Este comando nos creará el package.json y al poner ```-y``` damos unos valores por defecto que nos debería mostrar algo como esto: 

imagen aqui

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
      .use(cors)
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



