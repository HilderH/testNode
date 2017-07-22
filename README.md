
# Test de trabajo para Node.js

Este proyecto consite basicamente en poder mostrar shows por medio de una rest api y a su vez poder marcarlos como favoritos.

## Documentacion

Para proceder en el proyecto debemos seguir los siguientes pasos de manera que pueda estar el proyecto en un corrida exitosa.

### Requisitos
Debemos tener en cuenta algunos paquetes que debemos instalar en el entorno para correr este proyecto.

NodeJs como lenguaje Base para el Backend. Sails Js, se utiliza como framework (MVC) para estructurar el proyecto de una menera mas optimizada,MongoDB, como manejador de BD y Redis para el menejo de sesiones en localstorage.


## Correr el proyecto

Una vez instalado los paquetes descritos anteriormente, debemos trasladarnos a la carpeta que resulto despues de clonar el repositorio y seguir los siguientes pasos:

### Crear y enlazar la Base de datos

Para crear la base de datos podemos utilizar cualquier admin para mongo. Robomongo es uno, o AdminMongo tambien. Sin embargo aqui explicaremos como hacerlo a traves del shell de mongo.

Entramos al shell con el comando mongo en la terminal

```
mongo
```
El primer comando para crear la base de datos es para darle un nombre a la instancia y entrar en ella.

```
> use testShows (Es el nombre que esta en la configuracion para la conexion)
```
Luego, creamos cualquier campo para que nuestra para que la BD ya salga disponible en lista

```
> db.showDbList.insert( { Name : "Shows TV test Project" } );
```
Luego, creamos cualquier campo para que nuestra BD ya salga disponible en lista

```
> db.showDbList.insert( { Name : "Shows TV test Project" } );
```

Comprobamos que nuestra BD ya esta en la lista

```
> show dbs;

local      0.078GB
testShows  0.078GB
```
Por ultimo, debemos ir a la ruta y config/ y modificar el archivo connections.js cambiando los parametros para el nombre de Base de Datos

```
/* config/connections.js */

someMongodbServer: {
   adapter: 'sails-mongo',
   host: 'localhost',
   port: 27017,
   database: 'testShows'
 },
```

Luego de esto, debemos ir a la carpeta backups/ y restaurar los json con los siguientes comandos desde la terminal.

```
mongoimport --db testShows --collection user --file user.json --jsonArray
mongoimport --db testShows --collection favorite --file favorite.json --jsonArray
```
Debemos estar atentos a los campos identificadores de los registros. En algunos casos, segun la version, se importa los registros de la siguiente manera
```
{
    "_id" : "5930923556947b8c079d7e78",
    "name" : "Administrador",
    "lastname" : "Administrador",
    "username" : "admin",
    "email" : "admin@shows.com",
    "admin" : true,
    "password" : "09b8575e4bb65a19bf43cdb50cdcaa65",
    "updatedAt" : "2017-06-02T18:33:59.352Z"
}
```
La manera correcta que debe ir
```
{
    "_id" : ObjectId("5930923556947b8c079d7e78"),
    "name" : "Administrador",
    "lastname" : "Administrador",
    "username" : "admin",
    "email" : "admin@shows.com",
    "admin" : true,
    "password" : "09b8575e4bb65a19bf43cdb50cdcaa65",
    "updatedAt" : "2017-06-02T18:33:59.352Z"
}
```
### Installar paquetes en el package,json para estar disponibles en el node_modules

Un simple comando nos bastara para crear nuestra carpeta node_modules, desde la raiz de nuestro proyecto ejectuamos;

```
npm install
```

### Correr SailsJs

Con el comando principal del framework ya tendriamos disponible nuestro proyecto en el puerto 1337;

```
    sails lift
.
.
.
.
.

info:
info:                .-..-.
info:
info:    Sails              <|    .-..-.
info:    v0.12.13            |\
info:                       /|.\
info:                      / || \
info:                    ,'  |'  \
info:                 .-'.-==|/_--'
info:                 `--'-------'
info:    __---___--___---___--___---___--___
info:  ____---___--___---___--___---___--___-__
info:
info: Server lifted in `/var/www/html/test`
info: To see your app, visit http://localhost:1337
info: To shut down Sails, press <CTRL> + C at any time.

debug: -------------------------------------------------------
debug: :: Fri Jul 21 2017 22:56:53 GMT-0400 (VET)

debug: Environment : development
debug: Port        : 1337
debug: -------------------------------------------------------

```
Con esto ya podriamos testear este proyecto. Con las siguientes credenciales entramos y podremos ver el funcionamiento
```
user: admin@shows.com
pass: 123
```

## Documentacion sobre paquetes de instalacion
*  [NodeJs] (https://nodejs.org) - Lenguaje Backend
*  [Sails] (http://sailsjs.com/) - Framework MVC
*  [MongoDB] (https://www.mongodb.com/) - Manejador BD
*  [Redis] (https://redis.io/) - Manejo de sesion en localstorage
