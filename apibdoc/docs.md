FORMAT: 1A
HOST:http://127.0.0.1:3999/api/v1
# Welcome to Property Pro Lite API documentation page.

This page presents all routes and resource available in this Application Programming Interface.

# Group User access

## User collection [/auth]

### Create user account [POST/auth/signup]
+ Request (application/json)
    + Attributes 
        - User (User)

+ Response 201 (application/json)
    + Attributes
        - status: `success` (string) - This denotes the status of this operation
        - data (UserResponseData)

### Login a user [POST/auth/signin]
+ Request (application/json)
    + Attributes
        - email: `johndoe@mail.net` (string) - This denotes the user's email
        - password: `12345` (string) - This denotes the user's password
+ Response 200 (application/json)
    + Attributes
        - status: `success` (string) - This denotes the status of this operation
        - data (UserResponseData)

# Group Property

## Property Collection [/property]

### Create a property advert [POST/property]
+ Request (application/json)
    + Attributes
        - Property (Property)

+ Response 201 (application/json)
    + Attributes
        - status: `success` (string) - This denotes the status of this operation 
        - data (PropertyResponseData)

### Get a specific Property advert [GET/property/{id}]
+ Parameter
    - id: `1` (number) - This denotes the ID of the retreived property
+ Response 200 (application/json)
    + Attributes
        - status: `200` (number) - This denotes the status of this operation
        - data (PropertyResponseData)

### Get all Property adverts [GET/property] 
+ Response 200 (application/json)
    + Attributes
        - status: `201` (number) - This denotes the status of this operation
        - data (array[PropertyResponseData]) - This denotes a list of retreived properties

### Get all property adverts offering a specific type [GET/property/type?type=PropertyType]
+ Response 200 (application/json)
    + Attributes
        - status: `200` (number) - This denotes the status of this operation
        - data (array[PropertyResponseData]) - This denotes a list of retreived properties

### Update property data [PATCH/property/{id}]
+ Parameter
    - id:`1` (number) - This denotes the ID of the property to update
+ Request (application/json)
    + Attributes
        - price: `65000` (number) - This denotes the new price of the property
+ Response 200 (application/json)
    + Attributes
        - status: `success` (string) - This denotes the status of this operation
        - data (PropertyResponseData)

### Mark property as sold [PATCH/property/{id}/{sold}]
+ Parameter
    - id:`1` (number) - This denotes the ID of the property marked
    - sold: `sold` (string) - This denotes the that this property is marked as sold

+ Response 200 (application/json) 
    + Attributes
        - status: `success` (string) - This denotes the status of this operation
        - data (PropertyResponseData)

### Delete a Property advert [DELETE/property/{id}] 
+ Parameter
    - id: `1` (number) - This denotes the ID of the Property to delete

+ Response 200 (application/json)
    + Attributes
        - status: `success` (string) - This denotes the status of this operation
        - data (DeleteMessage)


# Data Structures

## User (object)
- id: `1` (number) - This denotes the ID of the User
- email: `king@mail.net` (string) - This denotes the email of the user
- first_name: `King` (string) - This denotes the first name of the User
- last_name: `James` (string) - This denotes the last name of the user
- password: `@%%^$#&` (string) - This denotes the password of the user
- phoneNumber: `08034734638` (string) - This denotes the phone number of the user
- address: `No.5 Main Street` (string) - This denotes the address of the user
- is_admin: true (boolean) - This denotes whether the user is an admin, capable posting property adverts

## Property (object)
- id: `1` (number) - This denotes the ID of the property
- owner: `1` (number) - This denotes the ID of the owner
- status: `available` (string) - This denotes that this property is available
- price: `60000` (number) - This denotes the price of this property
- state: `Abuja` (string) - This denotes the state or region in which this property is situated
- city: `Gwagwalada` (string) - This denotes the city in which this property is situated
- address: `No.45 Main Street, Agota` (string) - This denotes the address of the property
- type: `Duplex` (string) - This denotes the property category
- created_on: `2019-07-02T11:45:45.542Z` (string) - This denotes the date of property advert
- image_url: `https:https://res.cloudinary.com/uerterer/image/upload/v13847477/4387394749349vhf.png` (string) - This denotes the url to this property's image

## UserResponseData (object)
- token: `45erkjherht45495783` (string) - This denotes a token granted after authenticating a user
- id:`1` (number) - This denotes the ID of a user
- first_name: `King` (string) - This denotes the user's first name
- last_name: `James` (string) - This denotes the user's last name
- email: `king@mail.net` (string) - This denotes the user's email
## PropertyResponseData (object)
- id: `1` (number) - This denotes the ID of the property
- status: `available` (string) - This denotes that this property is available
- type: `Duplex` (string) - This denotes the property category
- state: `Abuja` (string) - This denotes the state or region in which this property is situated
- city: `Gwagwalada` (string) - This denotes the city in which this property is situated
- address: `No.45 Main Street, Agota` (string) - This denotes the address of the property
- price: `60000` (number) - This denotes the price of this property
- created_on: `2019-07-02T11:45:45.542Z` (string) - This denotes the date of property advert
- image_url: `https:https://res.cloudinary.com/uerterer/image/upload/v13847477/4387394749349vhf.png` (string) - This denotes the url to this property's image

## DeleteMessage (object)
- message: `Deleted successfully!` (string)