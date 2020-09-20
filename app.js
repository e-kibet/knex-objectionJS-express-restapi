require('dotenv').config();
var bodyParser = require('body-parser');

const express = require('express');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', async = (req, res, next) => {
    res.status(200).json({ status: true, status_message: 'data' });
})


app.listen(process.env.HOST_PORT, async = () => {
    console.log(`Listening at Port ${process.env.HOST_PORT}`);
})