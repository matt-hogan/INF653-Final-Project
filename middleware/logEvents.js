const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises
const path = require("path");

const logEvents = async (message) => {
    const dateTime = `${format(new Date(), "yyyy/MM/dd HH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}`;
    console.log(logItem);

    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", "eventLogs.txt"), logItem);
    } catch (error) {
        console.log(error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method} ${req.headers.origin} ${req.url}\n`, "reqLog.txt");
    console.log (`${req.method} ${req.path}`);
    next();
};


module.exports = { logEvents, logger };