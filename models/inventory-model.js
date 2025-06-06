const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getVehicleById(inv_id) {
    try {
        const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1", [inv_id])
        return data.rows[0]
    } catch (error) {
        throw error
    }
}

async function getInventoryByClassificationId(classificationId) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory WHERE classification_id = $1",
            [classificationId]
        );
        return data;
    } catch (error) {
        throw error;
    }
}

async function addClassification(classification_name) {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)"
    return await pool.query(sql, [classification_name]);
}

async function addInventory(data) {
    const sql = `INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;

    const params = [
        data.inv_make,
        data.inv_model,
        data.inv_year,
        data.inv_description,
        data.inv_image,
        data.inv_thumbnail,
        data.inv_price,
        data.inv_miles,
        data.inv_color,
        data.classification_id
    ];
    
    return await pool.query(sql, params);
}

module.exports = {getClassifications, getVehicleById, getInventoryByClassificationId, addClassification, addInventory}

