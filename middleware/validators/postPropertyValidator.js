import {check} from "express-validator";

const postPropertyValidator = [
    check("state").not().isEmpty().withMessage("Provide property's state")
        .isAlpha().withMessage("This value must be alphabetic")
        .isLength({min:2}).withMessage("value length must be greater than one")
        .trim().escape(),
    
    check("city").not().isEmpty().withMessage("Provide property's city")
        .isAlpha().withMessage("This value must be alphabetic")
        .isLength({min:2}).withMessage("value length must be greater than one")
        .trim().escape(),

    check("state").not().isEmpty().withMessage("Provide property's address")
        .isAlpha().withMessage("This value must be alphabetic")
        .isLength({min:2}).withMessage("value length must be greater than one")
        .trim().escape(),

    check("type").not().isEmpty().withMessage("Provide propert's type")
        .isAlpha().withMessage("This value must be alphabetic")
        .isLength({min:2}).withMessage("value length must be greater than one")
        .trim().escape(),
    
    check("price").not().isEmpty().withMessage("Provide the property's price")
        .isFloat().escape()
];


export default postPropertyValidator;