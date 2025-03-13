"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.membersRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const memberFunctions_1 = require("./memberFunctions");
const express_validator_2 = require("express-validator");
exports.membersRouter = (0, express_1.Router)();
const memberValidation = [
    (0, express_validator_1.body)('username').isString(),
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('role').isString()
];
const handleValidationErrors = (req, res) => {
    const errors = (0, express_validator_2.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return true;
    }
    return false;
};
exports.membersRouter.post('/new-member', memberValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (handleValidationErrors(req, res))
        return;
    const newMember = req.body;
    try {
        yield (0, memberFunctions_1.writeMember)(newMember);
        res.json(newMember);
    }
    catch (error) {
        next(error);
    }
}));
exports.membersRouter.get('/members', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield (0, memberFunctions_1.readMembers)();
    res.json(members);
}));
