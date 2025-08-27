import "dotenv/config"
import express from "express"
import usersController from "./Modules/Users/users.controller.js";
import dbConnection from './DB/db.connection.js';
import messagesController from "./Modules/Messages/messages.controller.js";

const app = express()


app.use(express.json())
app.use("/users", usersController)
app.use("/messages", messagesController)


dbConnection();

app.use(async (err, req, res, next) => {
    console.log(err.stack);
    if (req.session.inTransaction()) {
        await req.session.abortTransaction()
        req.session.endSession()
        console.log("the transaction is abort");

    }
    res.status(500).send("something broke!")
})

app.use((req, res) => {
    res.status(200).send("not found")
})

app.listen(process.env.PORT, () => {
    console.log("Server is running");
})