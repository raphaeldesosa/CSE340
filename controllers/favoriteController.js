const favoriteModel = require("../models/favorite-model")
const utilities = require("../utilities")

async function addToFavorites(req, res) {
    const { inv_id } = req.params
    const account_id = res.locals.accountData.account_id
    await favoriteModel.addFavorite(account_id, inv_id)
    req.flash("notice", "Vehicle added to favorites.")
    res.redirect("/inv/detail/" + inv_id)
}

async function viewFavorites(req, res) {
    const nav = await utilities.getNav(req,res)
    const account_id = res.locals.accountData.account_id
    const favorites = await favoriteModel.getFavoritesByAccount(account_id)
    const favoriteHTML = utilities.buildFavoritesView(favorites)
    res.render("account/favorites", {
        title: "My Favorites",
        nav,
        favoriteHTML,
        messages: req.flash("notice")
    })
}

async function removeFromFavorites(req, res) {
    const { inv_id } = req.params
    const account_id = res.locals.accountData.account_id
    await favoriteModel.removingFavorite(account_id, inv_id)
    req.flash("notice", "Vehicle removed from favorites.")
    res.redirect("/account/favorites")
}



module.exports = { addToFavorites, viewFavorites, removeFromFavorites}