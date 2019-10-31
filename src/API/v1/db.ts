"use strict";

import express from "express";
import fs from "fs";
import cors from "../../config/cors";
import Helper from "./helper";

const router = express.Router();

if (fs.existsSync("../../config/cors.js")) {
  router.use(cors);
}

// if (fs.existsSync("../../config/admin.js")) {
//   import ADMIN from "../../config/admin";
// }

const DATA = {};
const PrivateDATA = {};
const isDebug = process.env.NodeDB_DEBUG === "true";

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

/**
 * @apiDefine AdminHeader
 *
 * @apiHeader {String} secret You secret key. All data will be saved under this key.
 *
 */

/**
 * @api {get} /db Get value
 * @apiName GetValue
 * @apiGroup db
 * @apiVersion 0.1.1
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
router.get("/*", (req, res) => {
  const path = req.path.substr(1).split("/");
  if (isDebug) {
    console.log(`PATH: ${path}`);
  }
  let data = DATA;
  if (req.query.secret) {
    if (!PrivateDATA.hasOwnProperty(req.query.secret)) {
      PrivateDATA[req.query.secret] = {};
    }
    data = PrivateDATA[req.query.secret];
  }
  for (let i = 0; i < path.length; i++) {
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
 * @api {post} /db Get value
 * @apiName PostValue
 * @apiGroup db
 * @apiVersion 0.1.1
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
router.post("/*", (req, res) => {
  const path = req.path.substr(1).split("/");
  if (isDebug) {
    console.log(`PATH: ${path}`);
  }

  if (req.headers.secret instanceof Array) {
    throw new Error("Secret can not be array.");
  }

  let data = DATA;
  if (req.headers.secret) {
    if (!PrivateDATA.hasOwnProperty(req.headers.secret)) {
      PrivateDATA[req.headers.secret] = {};
    }
    data = PrivateDATA[req.headers.secret];
  }
  let p;
  for (let i=0; i<path.length; i++) {
    p = path[i];
    if (!data[p]) {
      data[p] = {};
    }
    if (i < (path.length - 1)) {
      data = data[p];
    }
  }
  if (!isNaN(req.body)) {
    data[p] = parseFloat(req.body);
  } else {
    try {
      data[p] = JSON.parse(req.body);
    } catch (e) {
      data[p] = req.body;
    }
  }
  Helper.returnJSON(res, {
    code: 1
  });
});

/**
 * @api {put} /db Save value
 * @apiName PutValue
 * @apiGroup db
 * @apiVersion 0.1.1
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
router.put("/", (req, res) => {
  let path = req.body.path || "";
  path = path.split("/");
  if (isDebug) {
    console.log(`PATH: ${path}`);
  }

  if (req.headers.secret instanceof Array) {
    throw new Error("Secret can not be array.");
  }

  let data = DATA;
  if (req.headers.secret) {
    if (!PrivateDATA.hasOwnProperty(req.headers.secret)) {
      PrivateDATA[req.headers.secret] = {};
    }
    data = PrivateDATA[req.headers.secret];
  }
  let p;
  for (let i = 0; i < path.length - 1; i++) {
    p = path[i];
    if (!data[p]) {
      data[p] = {};
    } else {
      if (typeof data[p] !== "object") {
        data[p] = {};
      }
    }
    data = data[p];
  }
  p = path[path.length - 1];
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

/**
 * @api {delete} /v1/db Delete value
 * @apiName DeleteValue
 * @apiGroup db
 * @apiVersion 0.1.2
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
// router.delete('/', (req, res) => {
//     if (!Helper.auth.admin(req, res)) { return; }
//     var from = new Date(Date.now() - 3 * 3600 * 24 * 1000);
//     if (req.query.hasOwnProperty('fromDate')) {
//         from = new Date(req.query.fromDate);
//     }
//     var orders = fsc.getBrokenOrders(from.toString());
//     var result = {
//         orders: orders
//     };

//     Helper.returnJSON(res, result);
// });

export = router;
