# **Field Authentication Manager**

### Features
A module that can Authenticate a Request according to the given set of rules, e.g:
```
Validators:
  * Check the Required Fields
  * Check the Types Of Fields
  * Email Validation
  * Validate given Regex pattern
  * Validate length(length, maxLength, minLength) of a field.
  * Validate value(max, min) of a field.
  * Avoid Empty Array Validation
```

### Installation
This is a [Node.js](https://nodejs.org/en/) module available through the npm registry.

Before installing, download and install [Node.js](https://nodejs.org/en/).
**Recommended** Use latest stable version of [Node.js](https://nodejs.org/en/).

Installation is done using the npm install command:
```
$ npm install field-authentication-manager
```

### Getting Started
After Installing module You need to do following steps:

* Create a folder for **Routes**.
* Create a file in that folder.
* Require the module and call it by passing a **Directory path** where route exist.
* After requiring module will return you a function.
* Call that function as a middleware and pass two parameters, e.g:
  * req => object of incomming request.
  * mountPath => path where your api starts.

```
const fieldAuthenticationManager = require('field-authentication-manager')({
	requiredFieldDirectoryPath: './controllers',
});

const app = express();

// parse application/json
app.use(bodyParser.json());

app.all('*', (req, res, next) => {
    const error = fieldAuthenticationManager({ req, mountPath: '/api/' });
    if (error) {
        return res.status(400).json(error);
    }
    return next();
});
```
#### **Note:** 
* You can pass (requiredFieldDirectoryPath & mountPath) as you want it is just for explanation
* You Must have to use [Body Parser](https://www.npmjs.com/package/body-parser) before using this Module.

#### Required Fields File for routes be Like
```
module.exports = {
  'project/:projectId (route-path)': {
          put (Request-Method): {
              body (Request Box-(body, query)): {
                  email: {
                      type: 'string',
                      isEmail: true,
                  },
                  value: {
                      test: {
                          type: 'string',
                          regex: /^\d+$/,
                          errorMessage: 'Must contain only digits',
                      },
                      data: {
                          email: {
                              type: 'string',
                              isEmail: true,
                              isOptional: true,
                          },
                      },
                  },
                  roleIds: [],
                  addresses: {
                      type: [],
                      avoidEmptyArray: true,
                  },
                  skills: [{
                      name: {
                          type: 'string',
                      },
                  }],
                  allowableKeys: ['key you only want in request body']
              },
          },
  }
}
```
#### **Note:** Remove text in brackets in this JS File (It is just for explanation)

## Module for
* [Node.js](https://nodejs.org/en/) - Backend framework
* [Express.js](https://expressjs.com/) - Module for making apps

## Author
The original author of Field Authentication Manager is [Sajjad Ali](https://github.com/isajjadali)
* **Sajjad Ali** - *JS Full Stack Engineer* 
  - [Linkedin](https://www.linkedin.com/in/iamsajjadali)
  - [Github](http://isajjadali.github.io)

## Contributors
* **Taimoor Ali** - *JS Full Stack Engineer* 
  - [Linkedin](https://www.linkedin.com/in/taimoor-ali-3b4674bb)
