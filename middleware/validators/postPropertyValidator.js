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

    check("address").exists().isString().custom((value,{req})=>{
            const expected = value;
            return expected.replace(/\s/g,'').length > 0;
        }).withMessage("Provide a valid address").escape(),

    check("type").isString().custom((value,{req})=>{
        const expected = value;
        return expected.replace(/\s/g,'').length > 0;
    }).withMessage("Provide a valid propert's type")
        .isAlphanumeric().withMessage("This value must be alphabetic")
        .isLength({min:2}).withMessage("value length must be greater than one")
        .trim().escape(),
    
    check("price").not().isEmpty().withMessage("Provide the property's price").escape()
];


export default postPropertyValidator;