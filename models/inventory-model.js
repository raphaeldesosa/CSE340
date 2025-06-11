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
    const data = await pool.query(
        `SELECT i.*, c.classification_name
        FROM inventory i
        JOIN classification c ON i.classification_id = c.classification_id
        WHERE i.classification_id = $1`,
        [classificationId]
    );
    return data;
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

async function updateInventory(data) {
    const sql = `UPDATE inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, 
                inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10
                WHERE inv_id = $11
                RETURNING *`

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
        data.classification_id,
        data.inv_id
    ];
    
    try {
        const result = await pool.query(sql, params);
        return result.rows[0];
    } catch (err) {
        console.error("Error updating inventory:", err)
        throw err;
    }
}


module.exports = {getClassifications, getVehicleById, getInventoryByClassificationId, addClassification, addInventory, updateInventory}

