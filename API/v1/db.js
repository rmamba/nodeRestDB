/*jslint es6 node:true */
"use strict";

const fs = require('fs');
const express = require('express');
const router = express.Router();

const Helper = require('./helper');

if (fs.existsSync('../../config/cors.js')) {
    const cors = require('../../config/cors');
    router.use(cors);
}

if (fs.existsSync('../../config/admin.js')) {
    const ADMIN = require('../../config/admin');
}

var DATA = {};
var PrivateDATA = {};
const isDebug = process.env.NodeDB_DEBUG === 'true';

// /**
//  * @apiDefine ReturnErrorMessage
//  *
//  * @apiError {json} Error Error message returned.
//  *
//  * @apiErrorExample Error-Response:
//  *     HTTP/1.1 400 Bad Request
//  *     {
//  *       "error": "Error message"
//  *     }
//  */

// /**
//  * @apiDefine AdminHeader
//  *
//  * @apiHeader {Number} tracking-api-id Admin's unique access-id.
//  * @apiHeader {String} tracking-api-key Admin's unique access-key.
//  * 
//  */

/**
 * @api {get} /db Statistical data
 * @apiName StatisticalData
 * @apiGroup webstats
 * @apiVersion 3.0.29
 * 
 * @apiUse AdminHeader
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {Array} daily Daily statistics.
 * @apiSuccess {Array} weekly Statistics based on day of the week.
 * @apiSuccess {Array} hourly Statistics based on the hour of the day.
 * @apiSuccess {Array} status Statistics based on the status of the order.
 * @apiSuccess {Object} statusProducts Statistics grouped by status and products.
 * @apiSuccess {Object} totals Sum of orders for daily statistics.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "daily": []
 * }
 *
 * @apiUse ReturnErrorMessage
 */
router.get('/*', function(req, res) {
    var path = req.path.substr(1).split('/');
    if (isDebug) {
        console.log(`PATH: ${path}`);
    }
    var data = DATA;
    if (req.query.secret) {
        if (!PrivateDATA.hasOwnProperty(req.query.secret)) {
            PrivateDATA[req.query.secret] = {}; 
        }
        data = PrivateDATA[req.query.secret];
    }
    for (let i=0; i<path.length; i++) {
        const p = path[i];
        if (!data[p]) {
            i = path.length;
        } else {
            data = data[p];
        }
    }
    Helper.returnJSON(res, data);
});

/**
 * @api {get} /webstats/stats Orders
 * @apiName GetOrders
 * @apiGroup webstats
 * @apiVersion 3.0.16
 * 
 * @apiUse AdminHeader
 *
 * @apiSuccess {Object} [pagination] Pagination data.
 * @apiSuccess {Array} orders Array of order data.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "pagination": {
 *     "prev": "2018-11-15T13:41:36.455Z",
 *     "limit": 50,
 *     "next": "2018-11-14T09:14:42.420Z"
 *   },
 *   "orders": [
 *     {
 *         orderData
 *     }
 *   ]
 * }
 *
 * @apiUse ReturnErrorMessage
 */
router.post('/', function(req, res) {
    var path = req.body.path || '';
    path = path.split('/');
    if (isDebug) {
        console.log(`PATH: ${path}`);
    }
    var data = DATA;
    if (req.headers.secret) {
        if (!PrivateDATA.hasOwnProperty(req.headers.secret)) {
            PrivateDATA[req.headers.secret] = {}; 
        }
        data = PrivateDATA[req.headers.secret];
    }
    for (let i=0; i<path.length; i++) {
        const p = path[i];
        if (!data[p]) {
            i = path.length;
        } else {
            data = data[p];
        }
    }
    Helper.returnJSON(res, data);
});

/**
 * @api {get} /webstats/stats Orders
 * @apiName GetOrders
 * @apiGroup webstats
 * @apiVersion 3.0.16
 * 
 * @apiUse AdminHeader
 *
 * @apiSuccess {Object} [pagination] Pagination data.
 * @apiSuccess {Array} orders Array of order data.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "pagination": {
 *     "prev": "2018-11-15T13:41:36.455Z",
 *     "limit": 50,
 *     "next": "2018-11-14T09:14:42.420Z"
 *   },
 *   "orders": [
 *     {
 *         orderData
 *     }
 *   ]
 * }
 *
 * @apiUse ReturnErrorMessage
 */
router.put('/', function(req, res) {
    var path = req.body.path || '';
    path = path.split('/');
    if (isDebug) {
        console.log(`PATH: ${path}`);
    }
    var data = DATA;
    if (req.headers.secret) {
        if (!PrivateDATA.hasOwnProperty(req.headers.secret)) {
            PrivateDATA[req.headers.secret] = {}; 
        }
        data = PrivateDATA[req.headers.secret];
    }
    var p;
    for (let i=0; i<path.length-1; i++) {
        p = path[i];
        if (!data[p]) {
            data[p] = {};
        } else {
            if (typeof data[p] !== 'object') {
                data[p] = {};
            }
        }
        data = data[p];
    }
    p = path[path.length-1];
    if (!isNaN(req.body.value)) {
        data[p] = parseFloat(req.body.value);
    } else {
        try {
            data[p] = JSON.parse(req.body.value);
        } catch (e) {
            data[p] = req.body.value;
        }
    }
    Helper.returnJSON(res, {
        code: 1
    });
});

router.delete('/:path', function(req, res) {
    if (!Helper.auth.admin(req, res)) { return; }
    var from = new Date(Date.now() - 3 * 3600 * 24 * 1000);
    if (req.query.hasOwnProperty('fromDate')) {
        from = new Date(req.query.fromDate);
    }
    var orders = fsc.getBrokenOrders(from.toString());
    var result = {
        orders: orders
    };

    Helper.returnJSON(res, result);
});

module.exports = router;