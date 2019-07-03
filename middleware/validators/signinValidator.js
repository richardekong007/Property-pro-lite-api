import {check} from "express-validator";

const signinValidator = [
    check("email").not().isEmpty().withMessage("provide an email").escape(),

    check("password").not().isEmpty().withMessage("Provide password").escape()
];

export default signinValidator;