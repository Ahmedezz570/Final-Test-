const express = require('express');
const router = express.Router();
const {loginUser,checkLoginStatus,loginStatus} = require('../controllers/authConrollers');

router.post("/login", loginUser);
router.post("/checkLogin", checkLoginStatus);
router.get("/getLoginStatus", loginStatus);


module.exports = router;
