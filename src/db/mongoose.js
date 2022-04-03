const mongoose = require('mongoose');

const connectionURL = 'mongodb://localhost:27017/';
const databaseName = 'bloggyDB';


mongoose.connect(connectionURL + databaseName, {
    useNewUrlParser: true,
    // useFindAndModify: false
    // useCreateIndex: true
})