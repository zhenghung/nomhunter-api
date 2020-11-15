# NomHunter API

## Prerequisites
1. Node (v12.^)
2. Docker (or PostgresSQL local installation)

## Docker Setup
In the project root directory, run the following to start containers for the DB and the pgAdmin4 tool
```
docker-compose up
```

### First-time setup of pgAdmin4
1. With both postgres and pgAdmin4 running on docker, get the postgres IP address with the following:
    ```
    docker ps --format "table {{.Names}}\t{{.ID}}" | grep 'postgres'
    ```
2. Copy the container id and inspect the IP address:
    ```
    docker inspect <container id> | grep -E -A 1 "IPAddress|Ports"
    ```
3. Access pgAdmin4 at localhost:5454, login with 
    ```
    domain: admin@nomhunter.com
    password: nomnom
    ```
4. Select `Servers` in the side bar and go to `Object > Create > Server...`
5. Fill in the details for the postgres db following the *docker-compose.yml* file. 
    * Use the IP Address obtained earlier for the host.

### For wiping docker if you ever run into trouble
Wipe all docker containers and images
```
docker system prune -a
docker volume prune
```
Wipe only postgres
```
docker volume rm nomhunter-api_postgres
```

## Installation

```bash
$ npm install
```

## Running the app
1. `docker-compose up`
2. `npm run start:dev`

## Scripts
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# Fix linting
$ npm run lint
```
