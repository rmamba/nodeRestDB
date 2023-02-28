"use strict"

import express from "express"
import Helper from "./helper"

const router = express.Router()

// if (fs.existsSync("../../config/admin.js")) {
//   import ADMIN from "../../config/admin"
// }

const DATA = {}
const PrivateDATA = {}
const isDebug = process.env.NodeDB_DEBUG === "true"

/**
 * @apiDefine ReturnErrorMessage
 *
 * @apiError {json} Error Error message returned.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Error message"
 *     }
 */

/**
 * @apiDefine AdminHeader
 *
 * @apiHeader {String} secret Optional secret key. All data will be saved under this key when used.
 *
 */

/**
 * @api {get} /v1/db/:path Get value
 * @apiName GetValue
 * @apiGroup db
 * @apiVersion 0.1.1
 *
 * @apiUse AdminHeader
 *
 * @apiParam {String} path JSON path for data to be returned.
 *
 * @apiSuccess {Object} data Returns JSON value for path.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "pi": 3.14
 * }
 *
 * @apiUse ReturnErrorMessage
 */
router.get("/*", (req, res) => {
  const path = req.path.substring(1).split("/")
  if (isDebug) {
    console.log(`PATH: ${path}`)
  }
  
  let data = DATA
  const secret = req.query.secret ? req.query.secret.toString() : req.header('secret')
  if (secret) {
    if (!PrivateDATA.hasOwnProperty(secret)) {
      PrivateDATA[secret] = {}
    }
    data = PrivateDATA[secret]
  }

  for (let p of path) {
    if (!data[p]) {
      break;
    } else {
      data = data[p]
    }
  }

  Helper.returnJSON(res, data)
})

/**
 * @api {post} /v1/db/:path Save value
 * @apiName PostValue
 * @apiGroup db
 * @apiVersion 0.1.1
 *
 * @apiUse AdminHeader
 *
 * @apiParam {String} path JSON path for data to be written at.
 *
 * @apiSuccess {Object} data Response data.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 OK
 * {
 *   "message": "OK"
 * }
 *
 * @apiUse ReturnErrorMessage
 */
router.post("/*", (req, res) => {
  const path = req.path.substring(1).split("/")
  if (isDebug) {
    console.log(`PATH: ${path}`)
  }

  let value: number | string
  if (typeof req.header('data') === "number") {
    value = parseFloat(req.header('data'))
  } else {
    try {
      value = JSON.parse(req.header('data'))
    } catch (e) {
      value = req.header('data')
    }
  }

  let data = DATA
  if (req.header('secret')) {
    if (!PrivateDATA.hasOwnProperty(req.header('secret'))) {
      PrivateDATA[req.header('secret')] = {}
    }
    data = PrivateDATA[req.header('secret')]
  }

  let p: string
  for (let i = 0; i < path.length; i++) {
    p = path[i]
    if (!data[p]) {
      data[p] = {}
    }
    if (i < (path.length - 1)) {
      data = data[p]
    }
  }

  data[p] = value
  Helper.returnJSON(res, {
    message: "OK"
  }, 201)
})

/**
 * @api {put} /v1/db Save value
 * @apiName PutValue
 * @apiGroup db
 * @apiVersion 0.1.1
 *
 * @apiUse AdminHeader
 *
 * @apiParam {String} body.path Path for data to be written at.
 * @apiParam {Object} data.value JSON data to be saved.
 *
 * @apiSuccess {Object} data Response data.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 OK
 * {
 *   "message": "OK"
 * }
 *
 * @apiUse ReturnErrorMessage
 */
router.put("/", (req, res) => {
  let path = req.body.path || ""
  path = path.split("/")
  if (isDebug) {
    console.log(`PATH: ${path}`)
  }

  let data = DATA
  if (req.header('secret')) {
    if (!PrivateDATA.hasOwnProperty(req.header('secret'))) {
      PrivateDATA[req.header('secret')] = {}
    }
    data = PrivateDATA[req.header('secret')]
  }

  let p: string
  for (let i = 0; i < path.length - 1; i++) {
    p = path[i]
    if (!data[p]) {
      data[p] = {}
    } else {
      if (typeof data[p] !== "object") {
        data[p] = {}
      }
    }
    data = data[p]
  }

  p = path[path.length - 1]
  if (!isNaN(req.body.value)) {
    data[p] = parseFloat(req.body.value)
  } else {
    try {
      data[p] = JSON.parse(req.body.value)
    } catch (e) {
      data[p] = req.body.value
    }
  }

  Helper.returnJSON(res, {
    message: "OK"
  }, 201)
})

/**
 * @api {delete} /v1/db/:path Delete value
 * @apiName DeleteValue
 * @apiGroup db
 * @apiVersion 0.1.2
 *
 * @apiUse AdminHeader
 *
 * @apiParam {String} path JSON path for data to be deleted at.
 *
 * @apiSuccess {Object} data Response data.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "OK"
 * }
 *
 * @apiUse ReturnErrorMessage
 */
router.delete('/*', (req, res) => {
  const path = req.path.substring(1).split("/")
  if (isDebug) {
    console.log(`PATH: ${path}`)
  }
  let data = DATA
  const secret = req.query.secret ? req.query.secret.toString() : req.header('secret')
  if (secret) {
    if (!PrivateDATA.hasOwnProperty(secret)) {
      PrivateDATA[secret] = {}
    }
    data = PrivateDATA[secret]
  }

  let p: string
  for (let i = 0; i < path.length; i++) {
    p = path[i]
    if (!data[p]) {
      data[p] = {}
    }
    if (i < (path.length - 1)) {
      data = data[p]
    }
  }

  delete data[p]
  Helper.returnJSON(res, {
    message: "OK"
  }, 200)
})

export = router
