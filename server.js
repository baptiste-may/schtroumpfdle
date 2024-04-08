const mysql = require("mysql");
const { PORT, MYSQL } = require("./config.json");
const path = require("path");
const express = require("express");
const app = express();
const HEADER_TYPE = {
    id: -1,
    name: 0,
    sex: 0,
    species: 0,
    ennemies: 1,
    looks: 1,
    first_episode: 2,
    img: -1
};
const cron = require("node-cron");
const cookieParser = require("cookie-parser");
let FINDED = [];
let CURRENT_STMPF;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src"));
app.use(express.static("public"));

const connection = mysql.createConnection(MYSQL);
connection.connect(async err => {
    if (err) throw err;
    console.info("✅ Connected to database!");

    const data = await query(connection, "SELECT COUNT(*) FROM Peoples;");
    console.log(`${data[0]["COUNT(*)"]} schtroumpfs loaded!`);

    await generateSchtroumpf();
    cron.schedule("0 0 * * *", () => {
        generateSchtroumpf(data);
    }, {
        timezone: "Europe/Paris"
    });
});


async function generateSchtroumpf() {
    const stmpf = (await query(connection, "SELECT * FROM Peoples ORDER BY RAND() LIMIT 1;"))[0];
    parseStmpf(stmpf);
    console.log(`Current schtroumpf : ${stmpf.name}`);
    CURRENT_STMPF = stmpf;
    FINDED = [];
}

function query(connection, sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

function parseStmpf(stmpf) {
    for (const key in stmpf) {
        if (typeof stmpf[key] == "string") {
            if (stmpf[key].includes(",")) {
                stmpf[key] = stmpf[key].split(",");
            }
        }
    }
}


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/index.html"))
});

app.get("/getSchtroumpfs", async (req, res) => {
    const data = await query(connection, "SELECT * FROM Peoples;");
    for (const stmpf of data) {
        parseStmpf(stmpf);
    }
    res.send(data);
});

app.get("/testSchtroumpfs*", async (req, res) => {
    if (!req.query.id) {
        res.sendStatus(403);
        return;
    }
    if (isNaN(parseInt(req.query.id))) {
        res.sendStatus(403);
        return;
    }
    const id = parseInt(req.query.id);
    const testedStmpfs = await query(connection, `SELECT * FROM Peoples WHERE id = ${id};`);
    if (testedStmpfs.length !== 1) {
        res.sendStatus(404);
        return;
    }
    const testedStmpf = testedStmpfs[0];
    parseStmpf(testedStmpf);
    const resJson = {};
    for (const key in HEADER_TYPE) {
        if (HEADER_TYPE[key] === 0) {
            resJson[key] = testedStmpf[key] === CURRENT_STMPF[key];
        } else if (HEADER_TYPE[key] === 1) {
            if (typeof testedStmpf[key] === typeof CURRENT_STMPF[key]) {
                if (Array.isArray(testedStmpf[key])) {
                    resJson[key] = {};
                    for (const tag of testedStmpf[key]) {
                        resJson[key][tag] = CURRENT_STMPF[key].includes(tag);
                    }
                } else {
                    resJson[key] = testedStmpf[key] === CURRENT_STMPF[key];
                }
            } else if (typeof testedStmpf[key] === "string") {
                resJson[key] = false;
            }
        } else if (HEADER_TYPE[key] === 2) {
            const testTime = testedStmpf[key].getTime();
            const currentTime = CURRENT_STMPF[key].getTime();
            if (testTime < currentTime) {
                resJson[key] = -1;
            } else if (testTime > currentTime) {
                resJson[key] = 1;
            } else {
                resJson[key] = 0;
            }
        }
    }
    if (resJson.name && req.query.finded === "false") {
        const name = req.cookies.name || "Anonyme";
        FINDED.push({
            name: name,
            date: new Date()
        });
        console.log(`Schtroumpf finded! [${name}]`);
    }
    res.send(resJson);
});

app.get("/getFinded", (req, res) => {
    res.send(FINDED);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
