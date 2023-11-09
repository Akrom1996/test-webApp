const {
    workerData,
    parentPort
} = require("worker_threads");

const waitFunction = async (time) => {
    console.log(time)
    await new Promise((resolve) =>
        setTimeout(function () {
            resolve();
        }, time),
    )
    parentPort.postMessage('Wait function finished')
}

waitFunction(workerData)