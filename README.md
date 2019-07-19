# Property-pro-lite-api
An API to power front-end pages of property pro lite web application. [![Build Status](https://travis-ci.org/richardekong007/Property-pro-lite-api.svg?branch=ch-update-readme-167396224)](https://travis-ci.org/richardekong007/Property-pro-lite-api)

[![Coverage Status](https://coveralls.io/repos/github/richardekong007/Property-pro-lite-api/badge.svg?branch=develop)](https://coveralls.io/github/richardekong007/Property-pro-lite-api?branch=develop)

**Environment variables**
Create a file at the project's root directory to store all environment variables. The name of this file should be '.env'. Then add the following variables to the file above.

**Cloudinary Image credential**
- CLOUDINARY_CLOUD_NAME = dcfenmfzt
- CLOUDINARY_API_KEY = 731441416642847
- CLOUDINARY_API_SECRET = xwPkswb14Vx6kR1PkOe2ev-kcdA
- CLOUDINARY_BASE_URL = https://res.cloudinary.com/dcfenmfzt
- CLOUDINARY_BASE_URL_SECURE = 	https://api.cloudinary.com/v1_1/dcfenmfzt

**Database connection details for both test and development environments**

- DB_MAX_CONN = 16
- DB_IDLE_TIMEOUT_MILLIS = 30000
- DB_HOST = localhost

**Test Database credentials**

- DB_TEST = test
- DB_USER_TEST = test
- DB_PSWD_TEST = test

**Development Database credentials**

- DB = dev
- DB_USER = dev
- DB_PSWD = dev

**JSON Web Token Detail**

- JWT_SECRET = you_secret_text
- EXPIRES_IN = 30m
- TEMP_TOKEN = NONE

**Requesting resources through API endpoints**

There are 10 endpoints in this API, which could be accessed locally or remotely through postman.
API Documentation can be found [here](https://property-pro-lite-api.herokuapp.com/docs.html)
- POST/api/v1/auth/signup
    - Request: 
    { 
        email: String,
        first_name:String,
        last_name:String,
        password:String,
        phone_number:String,
        address:String
    }

- POST/api/v1/auth/signin
    - Request:
    {
        email:String,
        password:String
    }

- POST/api/v1/property
    - Request
    {
        token:String,
        type:String,
        address:String, 
        city:String, 
        state:String,
        price:String, 
        image_url:String
    }
    **Note:** Use the form-data body to for this request.
    ![Post Property Ads](/uploads/property_req.png?raw=true "Posting Property Ads on Postman")

- POST/api/v1/flag
    - Request
    {
        token:String, 
        price:String
    }

- GET/api/v1/property
- GET/api/v1/property/{id}
- GET/api/v1/property/type?type=propertyType
    - Request
    {
        token:String
    }

    **Note:**propertyType could be Bungalow, Duplex, Mini flat or 2 Bedroom flats. The list goes on and could depend on what property type you already have in the database.

- PATCH/api/v1/property/{id}
    - Request
        {
            token:String
        }

- PATCH/api/v1/property/{id}/sold
    - Request
        {
            token:String
        }

- DELETE/api/v1/property/{id}
    - Request
        {
            token:String
        }

**Note**

- localhost: localhost or 127.0.0.1
- port number: 3999
- Remote host: https://property-pro-lite-api.herokuapp.com
- Tokens for all requests are automatically supplied once you signup or signin. There is no need to set Authorization headers on postman. This was done to ease the manual testing process.

**Manual testing**

In order to run this API manually, the following steps are enumerated below:

- Clone this repository, then change directory to this project's root through the terminal. 

- While in the project's root directory, install all project dependencies by executing:**npm install**

- Run the project by executing: **npm run start** or just **npm start** will do.

- Run test by executing: **npm run test**


