const { body, validationResult } = require("express-validator")
const utilites = require("./")
const invModel =  require("../models/inventory-model")

const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1})
            .withMessage("Please provide a classification name")
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Classification name must not contain any spaces or special characters"),
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        let nav = await utilites.getNav()
        res.render("inventory/add-classification", {
            title: "add-classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a make"),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a model"),
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 1886 })
            .withMessage("Please provide a valid year."),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a description."),
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please provide an image path."),
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please provide a thumbnail path."),
        body("inv_price")
            .trim()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."),
        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide a valid mileage."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a color."),
        body("classification_id")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Please choose a classification."),
  ]
}   

validate.checkInventoryData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        const nav = await utilites.getNav()
        const classificationSelect = await utilites.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors,
            classificationSelect,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        })
        return
    }
    next()
}

module.exports = validate 