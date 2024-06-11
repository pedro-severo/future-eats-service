# Future Eats Service

Future Eats Service is a backend service responsible for managing the endpoints consumed by Future Eats UI (https://github.com/pedro-severo/future-eats). It is a Node project built in typescript, exposed by a GraphQL interface and infraestructured with Firebase Services - including a non-SQL database (Firestore). The project is fully tested with jest (integration and unit tests), also with a coverage checking (100%) to push new changes 

# Summary

* [Getting Started](#getting-started)
* [Project Description](#project-description)
* [API](#API)

# <a name="getting-started">Getting Started</a>

Follow these steps to set up and run Future Eats API on your local machine.

### Prerequisites

Before you begin, make sure you have the following installed:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js and npm](https://nodejs.org/) - v.20
- [Firebase SDK](https://firebase.google.com/docs/admin/setup)

### Setup

1. (optional) **Install yarn:**

   consider to install yarn command to use it in place of npm command:

   ```bash
   npm install -g yarn
   ```
   more information here: https://www.npmjs.com/package/yarn


2. **Clone the repository:**

   ```bash
   git clone https://github.com/pedro-severo/future-eats-service.git
   ```

3. **Navigate to the project directory:**

   ```bash
   cd future-eats-service
   ```

4. **Install dependencies:**

   ```bash
   npm install
   ```
   or
   ```bash
   yarn install     

5. **Firebase setup**

   On `context.ts` file of database folder, you need change the path of this following line to point to the json file who gives you access on database:

   ```js   
   const serviceAccount = require('../../../../future-eats-service-5f069c811a09.json');
   ```

   To generate this json file with the key to access the databe, take a look here: https://firebase.google.com/docs/admin/setup
  
7. **Start the application:**

   ```bash
   npm run start
   ```
   or
   ```bash
   yarn start
   ```

8. **Open graphql api**
   
   Paste http://localhost:3003/ on browser to open graphql api and to consume queries and mutations of application


# <a name="project-description">Project Description</a> 

### Main technologies used

- [Node](https://nodejs.org/en)
- [Typescript](https://www.typescriptlang.org/)
- [Graphql](https://graphql.org/)
- [Firebase/Firestore](https://firebase.google.com/docs/firestore)
- [Jest](https://jestjs.io/)

### A description of the architecture

The endpoint are stored inside modules folders. Now, there are these modules on the project:

   - User


Folder structure of the project:

```
├── src/
│   ├── modules/
|   |   ├── {module_name}/ 
│   │      ├── controllers/  // gateway of endpoints: input checking and sanitization, response formating to be exposed on API
│   │      ├── entities/  // entities related to the module. Usualy, there is one main entity, like User entity on the user module, and some sub-entites
│   │      ├── graphql/  // all graphQL schema and types related the module
│   │      ├── repository/  // folder which stores the class who connect useCases with generic database service
│   │      ├── useCases/ =>  // self explanatory folder.
│   │      └── resolvers.ts =>  // file to register connect on GraphQL schema defined on graphql folder
│   ├── shared/
│   │   ├── database/
│   │   └── dependencies/  // dependency injection config
│   │   └── server/ 
│   │   └── services/
│   │      ├── authentication/  // authorization token management (token generating, checking, etc)
│   │      └── hash/  // password encripty service
│   │      └── uuid/  // id generation service

```


# <a name="API">API</a>

- [User](#user)

### Running 

`yarn (or npm) start`

Starts GraphQL server at http://localhost:3003/

## <a name="user">User</a>

- [Mutations](#user-mutations)
- [Queries](#user-queries)

Person who makes orders on app:

   ```js
      export type UserType = {
         id: string;
         name: string;
         email: string;
         password: string;
         hasAddress: boolean;
         cpf: string;
         mainAddressId?: string;
      };
   ```

### Sub-entities:

   - UserAddress
      ```js
      export type UserAddressType = {
         id: string,
         city: string,
         complement: string,
         state: string,
         streetNumber: string,
         zone: string,
         streetName: string
      }
      ```

### <a name="user-mutations">Mutations</a>

<details>
<summary>Signup</summary>
<br>
**Register a new user on database and return a token to be used on protected endpoints**

Response model:

```json
{
   "status": 201,
   "data": {
      "token": "Bearer token",
      "user": {
         "id": "string",
         "name": "Severo Snape",
         "email": "severo.snape@gmail.com",
         "cpf": "000000000",
         "hasAddress": false,
         "password": "encriptedPassword",
      }
   }
}
```


Here there are the graphQL related types:

``` graphql
type Mutation {
    signup(input: SignupInput): UserApiResponse!
}

input SignupInput {
    name: String!
    email: String!
    cpf: String!
    password: String!
}

type UserApiResponse {
    status: Int!
    data: UserResponse!
}

type UserResponse {
    user: User!
    token: String!
}

type User {
    id: String!
    name: String!
    email: String!
    cpf: String!
    hasAddress: Boolean!
    password: String!
}


```

Mutation example:

```graphql
 mutation signup(
     $email: String!
     $password: String!
     $cpf: String!
     $name: String!
 ) {
     signup(
         input: {
             email: $email
             password: $password
             cpf: $cpf
             name: $name
         }
     ) {
         status
         data {
             token
             user {
                 password
                 name
                 id
                 hasAddress
                 email
                 cpf
             }
         }
   }
}
```


</details>

<br>

<details>
<summary>Login</summary>
<br>
**Login flow. It returns a token to be used on protected endpoints.**

Response model:

```json
{
   "status": 200,
   "data": {
      "token": "Bearer token",
      "user": {
         "id": "string",
         "name": "Severo Snape",
         "email": "severo.snape@gmail.com",
         "cpf": "000000000",
         "hasAddress": false,
         "password": "encriptedPassword",
      }
   }
}
```


Here there are the graphQL related types:

``` graphql
type Mutation {
    login(input: LoginInput): UserApiResponse!
}

input LoginInput {
    email: String!
    password: String!
}

type UserApiResponse {
    status: Int!
    data: UserResponse!
}

type UserResponse {
    user: User!
    token: String!
}

type User {
    id: String!
    name: String!
    email: String!
    cpf: String!
    hasAddress: Boolean!
    password: String!
}


```

Mutation example:

```graphql
 mutation login(
     $email: String!
     $password: String!
 ) {
     login(
         input: {
             email: $email
             password: $password
         }
     ) {
         status
         data {
             token
             user {
                 password
                 name
                 id
                 hasAddress
                 email
                 cpf
             }
         }
   }
}
```

</details>

<br>

<details>
<summary>Register Address</summary>

<br>

**Create a UserAddress linked with the User who make the request (1:n).**

Response model:

``` json
{
   "status": 201,
   "data": {
      "city": "Lisbon",
      "complement": "1D",
      "state": "Metropolitan Zone of Lisbon", 
      "streetNumber": "34",
      "zone": "Campo de Ourique",
      "streetName": "4 de Infantaria",
      "id": "123"      
   }
}
```

Here there are the graphQL related types:

``` graphql
type Mutation {
    registerAddress(input: RegisterAddressInput): RegisterAddressApiResponse!
}

input RegisterAddressInput {
    userId: String!
    city: String!
    complement: String!
    state: String!
    streetName: String!
    streetNumber: String!
    zone: String!
}

type RegisterAddressApiResponse {
    status: Int!
    data: RegisterAddressResponse!
}

type RegisterAddressResponse {
    city: String!
    complement: String!
    state: String!
    streetNumber: String!
    zone: String!
    streetName: String!
    id: String!
}

```

Mutation example:
```graphql
   mutation registerAddress(
      $userId: String!
      $city: String!
      $complement: String
      $state: String!
      $streetName: String!
      $streetNumber: String!
      $zone: String!
   ) {
      registerAddress(
         input: {
            userId: $userId
            city: $city
            complement: $complement
            state: $state
            streetName: $streetName
            streetNumber: $streetNumber
            zone: $zone
         }
      ) {
         status
         data {
            city
            complement
            state
            streetNumber
            zone
            streetName
            id
         }
      }
   }
```

Authorization:
```graphql
{
  "Authorization": "Bearer token"
}
```

</details>


### <a name="user-queries">Queries</a>

<details>
<summary>Get Profile</summary>

<br>

**Give the common user (person who makes orders on app) details according this model:**

``` json
   {
      "status": 202,
      "data": {
        "name": "Severo Snape",
        "email": "severo.snape@email.com",
        "cpf": "000000000",
        "hasAddress": true,
        "address": "Spinner's End, s/n, complement, Cokeworth, England"
      }
   }
```
The option to use "Profile" instead "User" to name the endpoint (getProfile) is because the system doesn't returns a User if we see to entity. Instead, the system formats a specific response according the two entities related to a common user (User and UserAddress entities), merging specific keys of this two entities to generate the response above. 

Here there are the graphQL related types:

``` graphql
type Query {
    getProfile(input: GetProfileInput): GetProfileApiResponse!
}

input GetProfileInput {
    userId: String!
}

type GetProfileApiResponse {
    status: Int!
    data: GetProfileResponse!
}

type GetProfileResponse {
    id: String!
    name: String!
    email: String!
    cpf: String!
    hasAddress: Boolean!
    address: String
}
```

Query example:
```graphql
  getProfile(input: "") {
    status
    data {
      id
      name
      email
      cpf
      hasAddress
      address
    }
  }
```

Authorization:
```graphql
{
  "Authorization": "Bearer token"
}
```

</details>
