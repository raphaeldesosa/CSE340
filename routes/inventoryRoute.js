const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventoryController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

//-- Route to get vehicle details by inv_id
router.get("/type/:classificationId", utilities.handleErrors(inventoryController.buildByClassificationId))
router.get("/detail/:inv_id", utilities.handleErrors(inventoryController.buildDetailView))
router.get("/", utilities.handleErrors(inventoryController.buildManagement))
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(inventoryController.buildAddClassification))
router.post("/add-classification", utilities.checkLogin, utilities.checkAccountType, invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(inventoryController.addClassification))
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(inventoryController.buildAddInventory))
router.post("/add-inventory", utilities.checkLogin, utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(inventoryController.addInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(inventoryController.getInventoryJSON))

//--Route to edit inventory view by inv_id
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(inventoryController.buildEditInventory))
//--Route to post update
router.post("/update", utilities.checkLogin, utilities.checkAccountType, invValidate.newInventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(inventoryController.updateInventory))
//--Route for delete view
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(inventoryController.buildDeleteView))
//--Route actual deletion
router.post("/delete", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(inventoryController.deleteInventory))

module.exports = router