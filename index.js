/*jslint es6 node */
"use strict";

process.env.NODE_ENV = 'test';
process.env.NodeDB_DEBUG = 'true';

const express = require('express');
const app = express();
const version = require('./version');

// const bodyParser = require('body-parser');
// app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());

if (process.env.NodeDB_COMPRESSION === 'true') {
    const compression = require('compression');
    function shouldCompress(req, res) {
        if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false;
        }

        // fallback to standard filter function
        return compression.filter(req, res);
    }
    app.use(compression({filter: shouldCompress}));
}
app.set('json spaces', 2);

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
        title: "Node.JS REST DB",
        version: version.version,
        build: version.build,
        develop: process.env.NODE_ENV === 'test',
        endpoints: [
            "/v1"
        ]
    });
});

app.get('/v1', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
        title: "Node.JS REST DB",
        version: version.version,
        build: version.build,
        develop: process.env.NODE_ENV === 'test',
        endpoints: [
            "/db"
        ]
    });
});

const db_v1 = require('./API/v1/db');
app.use('/v1/db', db_v1);

const PORT = process.env.PORT || 3000;
module.exports = app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));