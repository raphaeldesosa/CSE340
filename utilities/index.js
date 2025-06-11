const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home Page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' + 
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"    
    })
    list += "</ul>"
    return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/**********************************
 * Build Vehicle detail view
 **********************************/
Util.buildDetailView = function(vehicle) {
    return `
        <div class="vehicle-detail">
            <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
            <div class="vehicle-info">
                <h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>
                <p><strong>Price:</strong> $${vehicle.inv_price.toLocaleString()}</p>
                <p><strong>Miles:</strong> ${vehicle.inv_miles.toLocaleString()} miles</p>
                <p><strong>Color:</strong> ${vehicle.inv_color}</p>
                <p><strong>Description:</strong> ${vehicle.inv_description}</p>
            </div>
        </div>`
                
}

Util.buildByClassificationGrid = function(data) {
    let grid = '<ul class="classification-grid">'
    data.forEach(vehicle => {
        grid += `
        <li>
            <a href="/inv/detail/${vehicle.inv_id}" title="View details for ${vehicle.inv_make} ${vehicle.inv_model}">
                <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
                <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
                <span>$${vehicle.inv_price.toLocaleString()}</span>
            </a>
        </li>`
    })
    grid += '</ul>'
    return grid
}

/************************
 * Classification List
 */

Util.buildClassificationList = async function (classification_id = null) {
    const data = await invModel.getClassifications()
    let classificationList = 
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList      
}

/************************************
 * Middleware to check token Validity
 ************************************/

Util.checkJWTToken = (req, res, next) => {
    if(req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please Log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

/****************************
 * Check Login
 ****************************/

Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

module.exports = Util