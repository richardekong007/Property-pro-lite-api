import {check} from "express-validator"

const signupValidator = [
    check("first_name").not().isEmpty().withMessage("provide first name")
    .isAlpha().withMessage("Must provide only alphabetic characters").
    isLength({min:2}).withMessage("name length must be greater 1 ").escape(),

    check("last_name").not().isEmpty().withMessage("provide first name")
    .isAlpha().withMessage("Must provide only alphabetic characters")
    .isLength({min:2}).withMessage("name length must be greater 1 ").escape(),

    check("email").not().isEmpty().withMessage("provide an email")
    .isEmail().withMessage("Provide a valid email").escape(),

    check("address").not().isEmpty().withMessage("Provide an address").escape(),

    check("phone_number").not().isEmpty().withMessage("Provide a phone number")
    .isMobilePhone().withMessage("Phone number is invalid"),

    check("password").not().isEmpty().withMessage("Provide password")
    .matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])","g")
    .withMessage("Password must contain atleast one uppercase, lowercase string , and a number")
    .isLength({min:7}).withMessage("password length must be greater than 6")
    .escape(),

    check("is_admin").not().isEmpty().withMessage("Are you an admin or not?")
    .isBoolean().withMessage("provide either true or false")

];

export default signupValidator;