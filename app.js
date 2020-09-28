require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
const indexRouter = require('./routes/index');
const locatorRouter = require('./routes/locator');
const smsRouter = require('./routes/sms');
const checkoutRouter = require('./routes/checkout');

app.use('/', indexRouter);
app.use('/locator', locatorRouter);
app.use('/sms', smsRouter);
app.use('/checkout', checkoutRouter);

// Creating server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port 3000!`);
});