const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
router.get("/",utilities.handleErrors(accountController.buildAccount))
router.get("/login",utilities.handleErrors(accountController.buildLogin))
router.get("/register",utilities.handleErrors(accountController.buildRegister))
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)    




module.exports = router