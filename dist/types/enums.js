"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryFilter = exports.ResponseStatus = void 0;
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["SUCCESS"] = "SUCCESS";
    ResponseStatus["SUCCESSEMPTY"] = "SUCCESSEMPTY";
    ResponseStatus["FAILURE"] = "FAILURE";
})(ResponseStatus || (exports.ResponseStatus = ResponseStatus = {}));
var QueryFilter;
(function (QueryFilter) {
    QueryFilter["ALL"] = "all";
    QueryFilter["COMPLETE"] = "complete";
    QueryFilter["INCOMPLETE"] = "incomplete";
})(QueryFilter || (exports.QueryFilter = QueryFilter = {}));
