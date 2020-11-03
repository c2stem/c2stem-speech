if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Speech = require('./models/speech');

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

const speechDetection = require('./routes/speechDetection');
const dashboardRoute = require('./routes/dashboardRoute');
port = process.env.PORT || 8201;
mongo_uri = process.env.MONGO_URI || 'mongodb://localhost:27017/speech';

mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MONGO CONNECTION OPEN!")
}).catch(err => {
    console.log("MONGO CONNECTION ERROR!!")
    console.log(err)
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home');
})

app.use('/speechDetection', speechDetection)
app.use('/dashboard', dashboardRoute)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500} =  err;
    if(!err.message) err.message = 'There is an error';
    res.status(status).render('error', { err })
})

app.listen(port, () => {
    console.log('Serving on port',port);
})