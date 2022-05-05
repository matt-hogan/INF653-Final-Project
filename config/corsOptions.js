// cross origin resouce sharing
const whitelist = ["https://atom-modern-vibraphone.glitch.me", "http://localhost:3000"];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }, optionsSuccessStatus: 200,
};

module.exports = corsOptions;