"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/", tasks_1.default);
mongoose_1.default.connect('mongodb+srv://dhanu0529:I1l1Ux1JdPh29c7s@cluster0.h5b5s2t.mongodb.net/?retryWrites=true&w=majority', {
    dbName: 'tasks'
})
    .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
        console.log(`Server is Fire at http://localhost:${PORT}`);
    });
});
