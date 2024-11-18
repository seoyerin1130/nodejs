const express = require('express');
const Depth = require('../models/depth')

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const depths = await Depth.findAll();
        res.render('sequelize', { depths }); 
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
