const express = require("express")
const cpus = require("os").cpus

var bodyParser = require('body-parser')
const cluster = require("cluster")
const db = require("./models")
const cron = require('node-cron');
const {
    Worker
} = require("worker_threads");

if (cluster.isMaster) {
    db.sequelize.sync().then((req) => {
        console.log("Sequelize synced")
    })
    for (let i = 0; i < cpus().length; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork()
    });
} else if (cluster.isWorker) {
    const app = express()

    app.use(bodyParser.urlencoded({
        extended: false
    }))

    app.use(bodyParser.json())
    const server = require('http').createServer(app)

    cron.schedule('10 * * * * *', () => {
        console.log('running a task every minute');
        const worker = new Worker("./worker1.js", {
            workerData: 60000 * 2,
        });
        worker.on("message", (data) => {
            console.log(`result from worker is: ${data}`);
        });
        worker.on("error", (msg) => {
            console.log(`An error from worker is: ${JSON.stringify(msg)}`);
        });
    }).start()

    const {
        User
    } = require("./models");

    app.get('/', async (req, res) => {
        const data = await User.findAll()
        return res.status(200).json({
            data
        })
    })

    server.listen('3001', () => console.log("Listening on port: %s, processId: %s", server.address().port, process.pid))
}