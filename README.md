# Personal Data App

Experimental personal data app built on top of [TypeScript-Node-Starter](https://github.com/microsoft/TypeScript-Node-Starter), with quite a fair bit of modifications.

# Table of contents:

- [Pre-reqs](#pre-reqs)
- [Getting started](#getting-started)
- [Deployment](#deployment)

# Pre-reqs

- [Node.js](https://nodejs.org/en/) minimally v14.10
- [MongoDB](https://docs.mongodb.com/manual/installation/)

# Getting started

Run `yarn install` to install all the project dependencies.

For development: run `yarn watch`.

# Build

If you need just to build the app (without running a dev server), simply run:

```shell
$ yarn build
```

# Test

To launch tests:

```shell
$ yarn test
```

# Deployment

## Run in Docker

```shell
docker-compose up
```
- use `-d` flag to run in background

## Tear down

```shell
docker-compose down
```

## To be able to edit files, add a volume to docker-compose file

```
volumes: ['./:/usr/src/app']
```

## To re-build

```shell
docker-compose build
```

## Health check

To perform a health check (also useful for Kubernetes), do a GET on `{URL}/health`, it should return 200.

# Docker
First, to build the container:

```shell
$ docker build - t personal-data-app .
```

Then to run the image:
```shell
docker run -p 8000:8000 -d personal-data-app
```

- `-p` exposes the internal port
- `-d` flag will run the container in the background
