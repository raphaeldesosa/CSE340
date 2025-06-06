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

async function buildManagement(req, res) {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
        title: "Inventory Management", 
        nav,
        messages: req.flash("notice")
    })
}

async function buildAddClassification(req, res) {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        messages: req.flash("notice") || [],
        errors: null,
        classification_name
    })
}

async function addClassification(req, res) {
    const nav = await utilities.getNav()
    const { classification_name } = req.body

    const result = await invModel.addClassification(classification_name)
    if (result) {
        req.flash("notice", `Successfully added ${classification_name}`)
        res.redirect("/inv")
    } else {
        req.flash("notice", "Failed to add classification")
        res.status(500).render("inventory/add-classification", {
            title: "add Classification",
            nav,
            messages: req.flash("notice") | [],
            errors: [{ msg: "Insert Failed" }],
            classification_name
        })
    }
}

async function buildAddInventory(req, res) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: null,
        classificationList,
    })
}

async function addInventory(req, res) {
    const nav = await utilities.getNav()
    const classificationId = parseInt(req.body.classification_id)
    const classificationList = await utilities.buildClassificationList(classificationId)

    const inventoryData = {
        ...req.body,
        classification_id: classificationId
    }

    const result = await invModel.addInventory(inventoryData)
    if (result) {
        req.flash("notice", "Inventory item added successfully")
        res.redirect("/inv")
    } else {
        req.flash("notice", "Failed to add to inventory")
        res.status(500).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: [{ msg: "Insert Failed" }],
            ...inventoryData
        })
    }
}

module.exports = {
    buildDetailView, buildByClassificationId, buildManagement, buildAddClassification, addClassification, buildAddInventory, addInventory
}