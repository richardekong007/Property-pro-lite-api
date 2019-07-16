import validator from "validator";

const patchPropertyValidator = (requestBody) =>{

    let valid = true;
    let errors = [];
    let error;
    let response = {};
    const keys = Object.keys(requestBody);

    if (keys.length < 2){
        error = 'No request!';
        valid = false;
        response = {valid:valid, error: error};
        return response;
    }
    
    keys.forEach(key =>{
        switch(key){
            case 'token':
                delete requestBody[key];
                break;
            case 'status':
                valid = valid && (validator.equals(requestBody[key], "available")
                              || validator.equals(requestBody[key], "sold"))
                errors.push(!(valid)? "status must be available or sold":"undefined");
                break;
            case 'price':
                valid = valid && (((typeof requestBody[key] === 'number') 
                              && ((requestBody[key] > 0.0))));
                errors.push(!(valid)? "price must be a non-empty float":"undefined");
                break;        
            case 'state':
            case 'city':
            case 'address':
            case 'type':
                valid = valid && (!(validator.isEmpty(requestBody[key]))
                              && (validator.isAlpha(requestBody[key]))
                              && (validator.isLength(requestBody[key],{min:2})))
                errors.push(!(valid)? `${key} value must be non-empty, alphabets with min length of 2`:"undefined");
                break;
            case 'created_on':
                valid = valid && (!(validator.isEmpty(requestBody[key]))
                              && ((requestBody[key] instanceof Date)))
                errors.push(!(valid)? `${key} value must be a valid date`:"undefined");
                break;
            case 'image_url':
                valid = valid && (!(validator.isEmpty(requestBody[key]))
                              && (validator.isURL(requestBody[key])))
                errors.push(!(valid) ? `${key} value must be non-empty, and a valid URL`:"undefined");
                break;
            default:
                valid =  false;
                errors.push(`${key} is invalid`);       
        }  
    });
    errors = errors.filter(error => error !== "undefined");
    response = {valid: valid, error:errors.join(", and ")};
    return response;
};

export default patchPropertyValidator;