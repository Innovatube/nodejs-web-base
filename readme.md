Nexty project

## Get Started

### 1. Prerequisites

- [NodeJs](https://nodejs.org/en/)
- [NPM](https://npmjs.org/) - Node package manager

### 2. Installation

On the command prompt run the following commands:

``` 
 $ git clone https://github.com/endanguyen/express-react-demo.git
 $ cd express-react-boilerplate
 $ cp .env.example .env (edit it with your secret key and database information)
 $ npm install
 ```
 Finally, start and build the application:
 
 ```
 $ npm run build (For production)
 $ npm run build:dev (For development)
```
List of NPM Commands:
 
  ```
  $ npm run lint       # linting
  $ npm run clean      # remove dist and node_modules folder and install dependencies
 ```
### 3. Usage

URL : http://localhost:3000/

Navigate to http://localhost:3000/swagger for the API documentation.

### 4. Useful Link
- Web framework for Node.js - [Express](http://expressjs.com/)
- JavaScript ORM  for Node.js - [Sequelize](http://docs.sequelizejs.com/)
- Database migrations and seed - [sequelize/cli] (https://github.com/sequelize/cli)
- JSON Web Tokens(jwt) - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- Logging Library - [Winston](https://www.npmjs.com/package/winston)
- Object schema validation  - [VALIDATE.JS](https://validatejs.org/)
- API documentation using [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc) and [swagger-ui](https://www.npmjs.com/package/swagger-ui)
- JavaScript library for building user interfaces - [React](https://facebook.github.io/react/)
- Predictable state container - [Redux](http://redux.js.org/)
- A React component library implementing Google's Material Design - [Material-UI](https://material-ui-1dab0.firebaseapp.com/)
- Declarative routing for React - [React-Router](https://reacttraining.com/react-router/)
- Promise based HTTP client - [Axios](https://github.com/mzabriskie/axios)
- Code linting tool - [ESLint](http://eslint.org/)
- I18n (https://react.i18next.com)

### 5. Start project with Docker compose

Run docker compose to build development environment.
 - MySQL 5.7
 - Node Web application

```bash
$ docker-compose up -d
```
URL : http://localhost:3000/
