const express = require('express');
const router = express.Router();
const Speech = require('../models/speech');
const catchAsync = require('../utils/catchAsync');

router.post('/', catchAsync(async (req, res, next) => {
    const detection = new Speech(req.body)
    await detection.save();
    res.end();
}));

module.exports = router;
