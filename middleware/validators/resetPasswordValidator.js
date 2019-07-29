import {check} from "express-validator"

const resetPasswordValidator = [
    check("password").not().isEmpty().withMessage("Provide password")
        .matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])","g")
        .withMessage("Password must contain atleast one uppercase, lowercase string , and a number")
        .isLength({min:7}).withMessage("password length must be greater than 6")
        .escape()
];

export default resetPasswordValidator;