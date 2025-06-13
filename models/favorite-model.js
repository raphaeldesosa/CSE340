const pool = require("../database/")

async function addFavorite(account_id, inv_id) {
    try {
        const sql = `INSERT INTO favorites (account_id, inv_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING 
                    RETURNING *`
        const result = await pool.query(sql, [account_id, inv_id])
        return result.rows[0]            
    } catch (error) {
        throw new Error("Adding favorite failed.")
    }
}

async function getFavoritesByAccount(account_id) {
    try {
        const sql = `SELECT f.*, i.inv_make, i.inv_model, i.inv_image, i.inv_price, i.inv_miles, 
                    i.inv_color, i.inv_description
                    FROM favorites f
                    JOIN inventory i ON f.inv_id = i.inv_id
                    WHERE f.account_id = $1`
        const result = await pool.query(sql, [account_id])
        return result.rows            
    } catch (error) {
        throw new Error("Fetching favorites failed.")
    }
}

async function removingFavorite(account_id, inv_id) {
    try {
        const sql = `DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2`
        await pool.query(sql, [account_id, inv_id])
    } catch (error) {
        throw new Error("Removing favorite failed.")
    }
}

module.exports = { addFavorite, getFavoritesByAccount, removingFavorite }