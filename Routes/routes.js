const express = require('express');
const router = new express.Router();
const controller = require('../Controllers/userControllers');
const upload = require("../MulterConfig/storageConfig");

// routes
router.post("/user/register",upload.single("user_profile_image"),controller.registerData)
router.get("/user/details",controller.displayDetails)
router.get('/user/:id',controller.getSingleUserData)
router.put("/user/edit/:id",upload.single("user_profile_image"),controller.EditUserProfile)
router.delete('/user/delete/:id',controller.deleteUserData)
router.put("/user/status/:id",controller.UpdateStatus)
router.get("/userexport",controller.UserExport)

module.exports=router