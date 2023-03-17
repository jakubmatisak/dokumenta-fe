# ITAPS Demo

Demo Vue projects as ITAPS standard.

## Imported libraries

Axios
Eslint
I18n
Vuetify
Vue Router
Vuex

## Using Sass

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Start db.json

```
json-server --watch db.json
```

## Docker

### Builds docker image with Dockerfile and tag it with name

```docker
docker build -t vuetest .
```

### Runs docker container

```docker
docker run vuetest
```

### Starts containers with frontend and reverse-proxy (by docker-compose.yml)

```docker
docker-compose up
# OR #
docker compose up
```

<br />

### Profiles

Dockerfile for this application uses variable active_profile, which default value is development. Application is using this variable to choose configuration file (development, production, test). You can set this variable during docker build command:

```
docker build --build-arg active_profile=production -t vue_demo .
```

If you have more containers, you can specify ARGs in docker-compose file like this:

```yml
build:
  args:
    active_profile: test
```

Finally, if you want to use variables in docker-compose file, you can use .env file in same directory as docker-compose.yml

```docker
#this is .env file
VUE_ACTIVE_PROFILE=production
```

```yml
#this is docker-compose.yml file
build:
  args:
    active_profile: ${VUE_ACTIVE_PROFILE}
```
