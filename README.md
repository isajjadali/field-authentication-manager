# **Field Authentication Manager**

### Features
A module that can Authenticate a Request according to the given set of rules, e.g:
```
Validators:
  * Required Fields
  * Types Of Fields
  * Filter Allowable Keys
  * Filter Removeable Keys 
  * Email Validation
  * Validate Given Regex Pattern
  * Validate Min And Max Length Of A Field.
  * Validate Min And Max Value Of A Field.
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
              body (Request Box - (body, query)): {
                // Max Length
                firstName: {
                    type: 'string',
                    maxLength: 12,
                },
                // Min Length
                lastName: {
                    type: 'string',
                    minLength: 3,
                },
                // Exact Length
                gender: {
                    type: 'string',
                    length: 1,
                },
                // Email
                email: {
                    type: 'string',
                    isEmail: true,
                },
                // Regex
                phoneNumber: {
                    type: 'string',
                    regex: /^(0)[0-9]{10}$/g,
                },
                // Number
                age: {
                    type: 'number',
                },
                //  Boolean
                active: {
                    type: 'boolean',
                },
                // Optional with avoid empty array if exist
                roleIds: {
                    type: 'array',
                    avoidEmptyArray: true,
                },
                roles: {
                    type: 'array',
                    isOptional: true,
                },
                user: {
                    type: 'object',
                    value: {
                        firstName: {
                            type: 'string',
                        },
                        user: {
                            type: 'object',
                            value: {
                                age: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
                emails: {
                    type: 'array',
                    value: {
                        user: {
                            type: 'object',
                            value: {
                                firstName: {
                                    type: 'string',
                                },
                                user: {
                                    type: 'object',
                                    value: {
                                        age: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                allowableKeys: ['key you only want in request body'],
                removeableKeys: ['key you don't want in request body'],
              },
          },
  }
}
```
#### **Note:** Field added in (allowableKeys and removeableKeys) will not work if you defined any rule above for that.
#### **Note:** Remove text in brackets in this JS File (It is just for explanation)

## A Field Must Be One Of The Following Type:
1. number
2. string
3. boolean
4. object 
5. array
## Triggering Keys With Thier Functionalities
```
isEmail => Validate Value As Email
Example: isEmail: true

isOptional => Make The Field Optional In Request
Example: isOptional: true

avoidEmptyArray => Send Error If The Array Is Empty
Example: avoidEmptyArray: true

regex => Match The Value As Per The Given Regex
Example: regex: /^\d+$/

errorMessage => Send Custom Message In Case Of Error
Example: errorMessage: 'Must contain only digits'

allowableKeys => Filter Out All Other Keys From The Request Except Mentioned In This Array
Example: allowableKeys: ['x', 'y', 'z']

removeableKeys => Filter Out The Mentioned Keys From The Request
Example: removeableKeys: ['x']

length => Check Exact Length Of Value
Example: length: 10

maxLength => Check Max Length Of Value
Example: maxLength: 20

minLength => Check Min Length Of Value
Example: minLength: 2

min => Check Min Value
Example: min: 10

max => Check Max Value
Example: max: 100
```

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
