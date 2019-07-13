import Router from "express";
import multer from "multer";
import signupValidator from "../../middleware/validators/signupValidator.js";
import signinValidator from "../../middleware/validators/signinValidator.js";
import postPropertyValidator from "../../middleware/validators/postPropertyValidator.js";
import {signupUser, signinUser} from "../route/controllers/user.controller.js";
import Authenticator from "../../middleware/authenticator.js";
import {postPropertyAdvert, updateProperty, markAsSold, deleteProperty, findAllProperties,
     findPropertyByType, findPropertyById} from "../route/controllers/property.controller.js";
import flagProperty from "../route/controllers/flag.controller.js";
import postFlagValidator from "../../middleware/validators/postFlagValidator.js";

const router = Router();

const storagePolicy = multer.diskStorage({
    destination : (req, file, callback) =>{
        callback(null, './uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
});

const fileFilter = (req, file, callback) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null, true);
    }else{
        callback(null,false);
    }
}

const upload = multer({storage:storagePolicy, limits:{
    fileSize: 1024 * 1024 * 20
},
    fileFilter: fileFilter
});

router.post("/auth/signup", signupValidator, signupUser);

router.post("/auth/signin", signinValidator , signinUser); 

router.post("/property", Authenticator.authenticate, upload.single('image_url'), postPropertyValidator, postPropertyAdvert); 

router.get("/property", Authenticator.authenticate, findAllProperties);

router.get("/property/type", Authenticator.authenticate,findPropertyByType);

router.get("/property/:id", Authenticator.authenticate,findPropertyById);

router.patch("/property/:id", Authenticator.authenticate, updateProperty);

router.patch(`/property/:id/:${"sold"}`, Authenticator.authenticate, markAsSold);

router.delete("/property/:id", Authenticator.authenticate,deleteProperty);

router.post("/flag", Authenticator.authenticate, postFlagValidator, flagProperty);

export default router;

