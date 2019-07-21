import {check} from "express-validator";

const postPropertyValidator = [
    
    check("city").exists().isNumeric().withMessage("Property's City should not be numeric")
    .isString().custom((value)=>value.replace(/\s/g,'')
    .length > 0).withMessage("Provide valid city").isLength({min:2})
    .withMessage("length must be greater than one")
    .trim().escape(),

    check("state").exists().isNumeric().withMessage("Property's State should not be numeric")
    .isString().custom((value)=>value.replace(/\s/g,'')
    .length > 0).withMessage("Provide valid state").isLength({min:2})
    .withMessage("length must be greater than one")
    .trim().escape(), 

    check("address").exists().not().isNumeric().withMessage("Property's address should not be numeric")
    .isString().custom((value)=>value.replace(/\s/g,'')
    .length > 0).withMessage("Provide valid address").isLength({min:2})
    .withMessage("length must be greater than one")
    .trim().escape(),

    check("type").exists().isNumeric().withMessage("property's type should not be numeric")
    .isString().custom((value)=>value.replace(/\s/g,'')
    .length > 0).withMessage("Provide a valid propert type")
    .isLength({min:2}).withMessage("value length must be greater than one")
    .trim().escape(),
    
    check("price").not().isEmpty().withMessage("Provide the property's price")
    .isFloat().withMessage("Input must be a float").escape()
];


export default postPropertyValidator;