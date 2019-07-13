import {check} from 'express-validator';

const postFlagValidator = [
    check('property_id').not().isEmpty().withMessage('Provide property id')
        .trim().escape(),
    
    check('reason').not().isEmpty().withMessage('Provide reason')
        .isLength({max:200}).withMessage('reason must not exceed 200 characters')
        .trim().escape(),
    
    check('description').not().isEmpty().withMessage('Provide a description')
        .isLength({max:200}).withMessage('Descritption must not exceed 200 characters')
        .trim().escape()
];

export default postFlagValidator;