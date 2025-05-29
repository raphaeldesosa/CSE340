const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

/* Get vehicles by classification Id */
async function buildByClassificationId(req, res, next) {
    const classificationId = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classificationId)
    const grid = await utilities.buildByClassificationGrid(data.rows)
    const nav = await utilities.getNav()

    res.render("inventory/classification", {
        title: data.rows[0]?.classification_name + " vehicles", nav, grid
    })
}

async function buildDetailView(req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const vehicleData = await invModel.getVehicleById(inv_id)
    const detailHtml = utilities.buildDetailView(vehicleData)

    res.render("inventory/detail", {
        title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, nav, detailHtml
    })
}

module.exports = {
    buildDetailView, buildByClassificationId
}