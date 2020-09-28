const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const name = undefined;
    const address = undefined;

    res.render('locator.ejs');
});

router.post('/', (req, res) => {
    const name = " " + req.body.firstName;
    const address = req.body.address;

    res.render('locator.ejs');
});

module.exports = router;