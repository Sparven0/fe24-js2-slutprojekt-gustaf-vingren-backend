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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMembers = readMembers;
exports.writeMember = writeMember;
const promises_1 = __importDefault(require("fs/promises"));
const path = './src/membersDB.json';
// läser json filen
function readMembers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rawData = yield promises_1.default.readFile(path, 'utf-8');
            if (!rawData) {
                return { members: [] };
            }
            return JSON.parse(rawData);
        }
        catch (error) {
            console.error('Error reading the file:', error);
            throw error;
        }
    });
}
// lägger till medlemmar
function writeMember(member) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield readMembers();
            const members = data.members || [];
            members.push(member);
            yield promises_1.default.writeFile(path, JSON.stringify({ members }, null, 2));
            console.log('Member added successfully');
        }
        catch (error) {
            console.error('Error writing member data:', error);
            throw error;
        }
    });
}
