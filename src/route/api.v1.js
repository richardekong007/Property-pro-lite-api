import Router from "express";
import multer from "multer";
import signupValidator from "../../middleware/validators/signupValidator.js";
import signinValidator from "../../middleware/validators/signinValidator.js";
import postPropertyValidator from "../../middleware/validators/postPropertyValidator.js";
import {signupUser, signinUser} from "../route/controllers/user.controller.js";
import {postPropertyAdvert, updateProperty, markAsSold, deleteProperty, findAllProperties,
     findPropertyByType, findPropertyById} from "../route/controllers/property.controller.js";

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

router.post("/property", upload.single('image_url'), postPropertyValidator, postPropertyAdvert); 

router.patch("/property/:id", updateProperty);

router.patch(`/property/:id/:${"sold"}`, markAsSold);

router.delete("/property/:id", deleteProperty);

router.get("/property", findAllProperties);

router.get("/property/type", findPropertyByType);

router.get("/property/:id", findPropertyById);

export default router;

