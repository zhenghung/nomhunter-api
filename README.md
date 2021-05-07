# NomHunter API

## Prerequisites
1. Node (v12.^)
2. Docker (or PostgresSQL local installation)

## Installation
```bash
$ npm install
```

## Environment Variables
Required environment variables, AWS S3 and GoogleMapsApi dependent features will not work properly otherwise.
```bash 
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
GOOGLE_PLACES_API_KEY
```
## Running the app
```bash 
$ docker-compose up
$ npm run start:dev
```
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

## Docker Setup
In the project root directory, run the following to start containers for PostgresSQL and Redis
```bash
$ docker-compose up
```

### For wiping docker if you ever run into trouble
Wipe all docker containers and images
```bash
$ docker system prune -a
$ docker volume prune
```
Wipe only postgres
```bash
$ docker volume rm nomhunter-api_postgres
```

## Extras
### First-time setup of pgAdmin4 (no longer included in docker-compose.yml)
1. With both postgres and pgAdmin4 running on docker, get the postgres IP address with the following:
    ```bash
    $ docker ps --format "table {{.Names}}\t{{.ID}}" | grep 'postgres'
    ```
2. Copy the container id and inspect the IP address:
    ```bash
    $ docker inspect <container id> | grep -E -A 1 "IPAddress|Ports"
    ```
3. Access pgAdmin4 at localhost:5454, login with
    ```
    domain: admin@nomhunter.com
    password: nomnom
    ```
4. Select `Servers` in the sidebar and go to `Object > Create > Server...`
5. Fill in the details for the postgres db following the *docker-compose.yml* file.
    * Use the IP Address obtained earlier for the host.

