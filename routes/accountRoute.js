const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
router.get("/welcome",utilities.handleErrors(accountController.buildAccount))
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

router.get("/update/:id", utilities.handleErrors(accountController.buildUpdateView))
router.post("/update", regValidate.updateRules(), utilities.handleErrors(accountController.updateAccount))
router.post("/update-password", regValidate.passwordRules(), regValidate.checkPasswordData, utilities.handleErrors(accountController.updatePassword))
router.get("/logout", utilities.handleErrors(accountController.logoutAccount))

module.exports = router