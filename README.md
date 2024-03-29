<p align="center">
  <a href="http://pokeapi.co/" target="blank"><img src="https://www.nintenderos.com/wp-content/uploads/2020/02/pokedex.jpg" width="200" alt="Nest Logo" /></a>
</p>

## Pokedex practice.

Practice of Nest, Docker, and more. 
A Pokedex with a statically served web at root is loaned.

Powered by Pokeapi.

## Stack

* Nest 
* Docker
* Mongo DB



## How to run the API:

1. Clone the repository
2. Run install
  2.1 Install Nest CLI
3. Up database
4. Run server
5. Clone the __.env.template__ file and change name to __.env__
6. Complete the ENV variables defined
7. Run the app
8. Populate the db

### 1 

```bash
git clone https://github.com/hernancur/nest-pokedex.git
```

### 2

```bash
$ yarn install
```

### 2.1

```bash
yarn add -g @nestjs/cli
```

### 3 

```bash
docker-compose up -d
```

### 7

```bash
$ yarn start:dev
```

### 8

Send one HTTP request to
```
http://localhost:3000/api/v2/seed
```


## Techs

- Nest
- Mongo db

## Stay in touch

- Author - [Hernán Garcia](https://hernancurr.vercel.com)
