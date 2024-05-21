# Future Eats Service (readme in progress...)

Future Eats Service is a backend service responsible for managing various aspects of the Future Eats UI (https://github.com/pedro-severo/future-eats). It handles user authentication, restaurant management, menu items, orders, and more.

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

5. **Start the application:**

   ```bash
   npm run start
   ```
   or
   ```bash
   yarn start
   ```

6. **Open graphql api**
   
   Paste http://localhost:3003/ on browser to open graphql api and to consume queries and mutations of application

<br>

### Another coomands:

TODO: list all comands of the project

<br>

# <a name="project-description">Project Description</a> 

### Main technologies used

- [Node](https://nodejs.org/en)
- [Typescript](https://www.typescriptlang.org/)
- [Graphql](https://graphql.org/)
- [Firebase/Firestore](https://firebase.google.com/docs/firestore)
- [Jest](https://jestjs.io/)

### A description of the architecture

TODO:


# <a name="API">API</a>

- [User](##user)

### Running 

`yarn (or npm) start`

Starts GraphiQL server at http://localhost:3003/

## <a name="user">User</a>

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

### Mutations

<details>
<summary>Signup</summary>

</details>

<br>

<details>
<summary>Login</summary>

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

Query example:
```graphql
  registerAddress(
    input: {
     city: "Lisbon",
     complement: "1D",
     state: "Metropolitan Zone of Lisbon", 
     streetNumber: "34",
     zone: "Campo de Ourique",
     streetName: "4 de Infantaria",
     userId: "123"  
   }) {
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
```

Authorization:
```graphql
{
  "Authorization": "Bearer token"
}
```

</details>


### Queries

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