const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")


/* Get vehicles by classification Id */
async function buildByClassificationId(req, res, next) {
    const classificationId = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classificationId)
    const grid = await utilities.buildByClassificationGrid(data.rows)
    const nav = await utilities.getNav(req,res)

    res.render("inventory/classification", {
        title: data.rows[0]?.classification_name + " vehicles", nav, grid
    })
}

async function buildDetailView(req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav(req,res)
    const vehicleData = await invModel.getVehicleById(inv_id)
    const detailHtml = utilities.buildDetailView(vehicleData)

    res.render("inventory/detail", {
        title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, 
        nav, 
        detailHtml,
        vehicle: vehicleData,
        accountData: res.locals.accountData || null
    })
}

async function buildManagement(req, res) {
    let nav = await utilities.getNav(req,res)
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: "Inventory Management", 
        nav,
        messages: req.flash("notice"),
        classificationSelect,
    })
}

async function buildAddClassification(req, res) {
    const nav = await utilities.getNav(req,res)
    const classification_name = ""
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        messages: req.flash("notice") || [],
        errors: null,
        classification_name
    })
}

async function addClassification(req, res) {
    const nav = await utilities.getNav(req,res)
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
            messages: req.flash("notice") || [],
            errors: [{ msg: "Insert Failed" }],
            classification_name
        })
    }
}

async function buildAddInventory(req, res) {
    const nav = await utilities.getNav(req,res)
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: null,
        classificationList,
    })
}

async function addInventory(req, res) {
    const nav = await utilities.getNav(req,res)
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

/********************************************
 * Return inventory by Classification as JSON
 ********************************************/

async function getInventoryJSON(req, res, next) {
    const classification_id = parseInt(req.params.classification_id)
    const result = await invModel.getInventoryByClassificationId(classification_id)
    const invData = result.rows
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/************************************
 * Edit Inventory
 ************************************/

async function buildEditInventory(req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav(req,res)

    const itemData = await invModel.getVehicleById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

async function updateInventory(req, res, next) {
    const nav = await utilities.getNav()
    const {
         inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory({
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    })

    if (updateResult) {
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry the update failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

async function buildDeleteView(req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav(req,res)
    const itemData = await invModel.getVehicleById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        classificationList: await utilities.buildClassificationList(itemData.classification_id),
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
    })
}

async function deleteInventory(req, res, next) {
    const nav = await utilities.getNav(req,res)
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult.rowCount) {
        req.flash("notice", "Inventory item deleted.")
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Deletion Failed")
        res.redirect(`/inv/delete/${inv_id}`)
    }
}

module.exports = {
    buildDetailView, buildByClassificationId, buildManagement, buildAddClassification, addClassification, buildAddInventory, addInventory, getInventoryJSON, buildEditInventory,
    updateInventory, buildDeleteView, deleteInventory
}