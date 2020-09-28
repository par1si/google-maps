const express = require('express');
const router = express.Router();

const accountSid = 'AC95d016e2d6808714cfc025add2c75b09';
const authToken = process.env.TWILIO_API_TOKEN;
const client = require('twilio')(accountSid, authToken);

router.post('/', (req, res) => {
    const company = req.body.company;
    const number = req.body.number.replace(/[^\d\+]/g,"");
    const address = req.body.address;
    const location = req.body.location.split(" ").join("").replace(/[{()}]/g, '');

    client.messages
    .create({
        body: `The nearest ${company} is located at ${address}. Open on Google Maps at: https://www.google.com/maps/dir/?api=1&destination=${location}`,
        from: '+13605259996',
        to: number
    })
    .then(message => console.log(`Text message sent to ${number}. SMS Id: ${message.sid}`));

});

module.exports = router;