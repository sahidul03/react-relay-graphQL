const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// allow cross-origin requests
app.use(cors());

// connect to mongo database database or you can connect with your mlab database
mongoose.connect('mongodb://localhost/ghaphql-shop')

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

// bind express with graphql
app.use('/ghaphql-shop', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4040, () => {
    console.log('now listening for requests on port 4040');
});
