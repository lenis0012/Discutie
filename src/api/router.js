"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var chat_1 = require("./chat");
var body_parser_1 = require("body-parser");
exports.default = (0, express_1.Router)()
    .use(body_parser_1.default.json())
    .post('/chat', chat_1.submitChat)
    .all('/*all', function (req, res) {
    res.status(404).end();
});
