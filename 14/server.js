require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const { connect } = require('http2');

// Connect to MongoDB
connectDB();



const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// cross origin resource sharing
app.use(cors(corsOptions));

// built-in middlewaret to handle urlencoded data (form data)
// 'content-type: applicatiom/x-www-formurlencoded'
app.use('/', express.urlencoded({ extended: false}));

// middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());
// serve static files
app.use(express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));


app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));


// app.use('/')

app.all(`*`, (req, res) => { // * select all
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }
});
/*
app.get('/chain(.html)?', [one,two,three]); 123 are functions
*/

app.use(errorHandler);

// ensure connection is made before listening for anything else
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});