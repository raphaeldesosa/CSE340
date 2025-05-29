const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventoryController")
const utilities = require("../utilities/")

//-- Route to get vehicle details by inv_id
router.get("/type/:classificationId", utilities.handleErrors(inventoryController.buildByClassificationId))
router.get("/detail/:inv_id", utilities.handleErrors(inventoryController.buildDetailView))

module.exports = router