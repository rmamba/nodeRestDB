/*jslint es6 node:true */
"use strict";

export = {
  returnJSON: function returnJSON(res, json, status = 200) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status);
    res.json(json);
  },
  returnHTML: function returnHTML(res, html) {
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  },
  returnError: function returnError(res, errorOrMessage, status = 400, group='generic') {
    var errorMessage = `ERROR[${group}]: ${errorOrMessage}`;
    if (errorOrMessage instanceof Error) {
        errorMessage = `ERROR[${group}]: ${errorOrMessage.message}`;
    }
    console.log(errorMessage);
    var errorData = {
        error: errorMessage,
        stackTrace: undefined
    };
    if (errorOrMessage instanceof Error) {
        errorData.stackTrace = errorOrMessage.stack;
    }
    module.exports.returnJSON(res, {
        error: errorMessage
    }, status);
  },
  returnErrors: function returnErrors(res, messageArray, group='generic') {
    if (messageArray.length > 0) {
        const errorData = {
            error: "Critical error(s) encountered.",
            errors: messageArray
        };
        module.exports.returnJSON(res, errorData, 400);
    }
  }
}
