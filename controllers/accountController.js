const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
/********************
 * Deliver Login View
 ********************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav(req,res)
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

async function buildAccount(req, res, next) {
    let nav = await utilities.getNav(req,res)
    res.render("account/account", {
        title: "My Account",
        nav,
    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav(req,res)
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
    let nav = await utilities.getNav(req,res)
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
    let nav = await utilities.getNav(req,res)
    const  { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
            messages: req.flash("notice")
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("notice", "Please check your credentials and try again")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
                messages: req.flash("notice")
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
} 


async function buildAccountManagement(req, res) {
    let nav = await utilities.getNav(req,res)
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        messages: req.flash("notice") || [],
        errors: null
    })
}

async function buildUpdateView(req, res) {
    const nav = await utilities.getNav(req,res)
    const accountData = await accountModel.getAccountById(req.params.id)
    res.render("account/account-update", {
        title: "Update Account",
        nav,
        accountData,
        errors: null
    })
}

async function updateAccount(req, res) {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
    const nav = await utilities.getNav(req,res)
    const accountData = await accountModel.getAccountById(account_id)
    const notice = updateResult ? "Update successful!" : "Update failed"
    req.flash("notice", notice)
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        accountData,
        messages: req.flash("notice") || [],
        errors: null
    }
    )
}

async function updatePassword(req, res) {
    const { account_id, account_password } = req.body
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updatePassword(account_id, hashedPassword)
    req.flash("notice", result ? "Password updated" : "Password update failed")
    res.redirect("/account")
}

async function logoutAccount(req, res) {
    res.clearCookie("jwt")
    req.flash("notice", "You have successfully logged out.")
    res.redirect("/")
}



module.exports = { buildLogin, buildAccount, buildRegister, registerAccount, accountLogin, buildAccountManagement,
    buildUpdateView, updateAccount, updatePassword, logoutAccount
 }