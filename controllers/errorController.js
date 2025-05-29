function triggerError(req, res, next) {
    throw new Error("Intentional Server error (500)")
}

module.exports = { triggerError }