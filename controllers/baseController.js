const utilities = require("../utilities/")
const baseContoller = {}

baseContoller.buildHome = async function(req, res){
    const nav = await utilities.getNav(req,res)
    const messages = req.flash("notice")
    req.session.notice = null;
    res.render("index", {
        title: "Home", 
        nav,
        messages
    })
}

module.exports = baseContoller