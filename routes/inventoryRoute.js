const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventoryController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

//-- Route to get vehicle details by inv_id
router.get("/type/:classificationId", utilities.handleErrors(inventoryController.buildByClassificationId))
router.get("/detail/:inv_id", utilities.handleErrors(inventoryController.buildDetailView))
router.get("/", utilities.handleErrors(inventoryController.buildManagement))
router.get("/add-classification", utilities.handleErrors(inventoryController.buildAddClassification))
router.post("/add-classification", invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(inventoryController.addClassification))
router.get("/add-inventory", utilities.handleErrors(inventoryController.buildAddInventory))
router.post("/add-inventory", invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(inventoryController.addInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(inventoryController.getInventoryJSON))

//--Route to edit inventory view by inv_id
router.get("/edit/:inv_id", utilities.handleErrors(inventoryController.buildEditInventory))
//--Route to post update
router.post("/update", invValidate.newInventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(inventoryController.updateInventory))

module.exports = router