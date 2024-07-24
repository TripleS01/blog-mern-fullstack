const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MONGO_URL, PORT_URL, REACT_URL } = require('./src/config/constants');
const router = require('./routes');

const app = express();

app.use(cors({
    credentials: true,
    origin: REACT_URL,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/', router);

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log(`mern-fullstack is connected to DB`);

        app.listen(PORT_URL, () => console.log(`Server is listening on http://localhost:${PORT_URL}...`));
    })
    .catch(error => console.log('Cannot connect to DB'));