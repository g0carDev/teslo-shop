# Next.js TesloShop App

Para correr localmente, se necesita la base de datos

```bash
docker-compose up -d
```

* El -d, significa __detached__ o __desconectado__, es decir, que no se va a quedar esperando a que se cierre la terminal para seguir corriendo.

MongoDB URL Local:

```bash
mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno

Crea un archivo en la raíz del proyecto llamado `.env` y copia el contenido del archivo `.env.template` y reemplaza los valores de las variables de entorno.

## Reconstruir modulos de node y levantar Next.js

```bash
yarn install
yarn dev
```

## Llenar la base de datos con informacion de pruebas

Llamara:

```bash
http://localhost:3000/api/seed
```
