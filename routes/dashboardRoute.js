const express = require('express');
const router = express.Router();
const Speech = require('../models/speech');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.get('/', catchAsync(async (req, res, next) => {
    const utterance_raw = await Speech.find({}).sort({updated: -1});
    if (!utterance_raw){
        return next(new ExpressError('speech data not found', 404));
    }
    const utterance = JSON.stringify(utterance_raw)
    const usersList = await Speech.distinct("user")
    if(!usersList){
        return next(new ExpressError('unique user list was not found', 404));
    }
    const userList = JSON.stringify(usersList)
    res.render('dashboard', {data: {utter: utterance, users: userList}}) 
}))

module.exports = router;
