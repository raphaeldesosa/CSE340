const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
/********************
 * Deliver Login View
 ********************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

async function buildAccount(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account", {
        title: "My Account",
        nav,
    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/**************************
 * Process Registration
 **************************/

async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    let hashedPassword 
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration')
        return res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

async function accountLogin(req, res) {
    const  { account_email, account_password } = req.body
    const nav = await utilities.getNav()
    
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: [{ msg: "Invalid email or password." }],
            account_email
        })
    }
}

module.exports = { buildLogin, buildAccount, buildRegister, registerAccount, accountLogin }