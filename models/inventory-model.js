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

module.exports = {getClassifications, getVehicleById, getInventoryByClassificationId}

