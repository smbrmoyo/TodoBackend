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
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const GETHandlers_1 = require("./db/handlers/GETHandlers");
const enums_1 = require("./types/enums");
const tableHandlers_1 = require("./db/handlers/tableHandlers");
const POSTHandlers_1 = require("./db/handlers/POSTHandlers");
const PUTHandlers_1 = require("./db/handlers/PUTHandlers");
const DELETEHandlers_1 = require("./db/handlers/DELETEHandlers");
const errorHandling_1 = require("./utils/errorHandling");
const models_1 = require("./types/models");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const httpServer = (0, http_1.createServer)(app);
app.use(express_1.default.json());
app.use(errorHandling_1.errorHandler);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, tableHandlers_1.createTodoTable)();
    }
    catch (error) {
        console.error("Error initializing DynamoDB table:", error);
        process.exit(1);
    }
}))();
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Server Running.\nUse the correct API endpoint path to access resource");
}));
app.get("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lastKey, completed, sort_by } = req.query;
    const lastKeyString = lastKey != "" ? lastKey : undefined;
    const completedString = typeof completed === "string" && completed != "" ? completed : undefined;
    const sortByString = typeof sort_by === "string" ? sort_by : undefined;
    const result = yield (0, GETHandlers_1.fetchTodos)(lastKeyString, completedString, sortByString);
    console.log(result.data.length);
    if (result.status != enums_1.ResponseStatus.FAILURE) {
        res.status(200).json(result);
    }
    else {
        res.status(400).json(result);
    }
}));
app.get("/tasks/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield (0, GETHandlers_1.getTodoById)(id);
        if (result.status === "FAILURE") {
            throw new models_1.HttpError(result.error || "Item not found", 404);
        }
        res.status(200).json(result);
    }
    catch (error) {
        let err = error;
        res.status(err.statusCode).json(err.message);
    }
}));
app.post("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskDescription, dueDate, completed } = req.body;
    const result = yield (0, POSTHandlers_1.createTodo)(taskDescription, dueDate, completed);
    if (result.status != enums_1.ResponseStatus.FAILURE) {
        res.status(201).json(result);
    }
    else {
        res.status(400).json(result);
    }
}));
app.put("/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, taskDescription, dueDate, createdDate, completed } = req.body;
    const result = yield (0, PUTHandlers_1.updateTodo)(id, taskDescription, dueDate, createdDate, completed);
    if (result.status != enums_1.ResponseStatus.FAILURE) {
        res.status(200).json(result);
    }
    else {
        res.status(400).json(result);
    }
}));
app.delete("/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, DELETEHandlers_1.deleteTodo)(id);
    if (result.status != enums_1.ResponseStatus.FAILURE) {
        res.status(200).json(result);
    }
    else {
        res.status(400).json(result);
    }
}));
httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
