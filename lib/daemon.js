const path = require('path');
const os = require('os');
const root = (os.platform == 'win32') ? process.cwd().split(path.sep)[0] : '/';
const fs = require('fs');
const pm2 = require('pm2');
const exitHook = require('exit-hook');

fs.writeFileSync(path.join(root, 'rpm2.proc'), process.pid.toString());

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/start', (req, res) => {
    if (req.body.process == undefined || req.body.process == null) return res.sendStatus(400);

    pm2.start(req.body.process, (err, data) => {
        if (err) return res.send(err);
        res.send(data);
    })
});

app.post('/stop', (req, res) => {
    if (req.body.process == undefined || req.body.process == null) return res.sendStatus(400);

    pm2.stop(req.body.process, (err, data) => {
        if (err) return res.send(err);
        res.send(data);
    })
});

app.post('/restart', (req, res) => {
    if (req.body.process == undefined || req.body.process == null) return res.sendStatus(400);

    pm2.restart(req.body.process, (err, data) => {
        if (err) return res.send(err);
        res.send(data);
    })
});

app.post('/delete', (req, res) => {
    if (req.body.process == undefined || req.body.process == null) return res.sendStatus(400);

    pm2.delete(req.body.process, (err, data) => {
        if (err) return res.send(err);
        res.send(data);
    })
});

app.get('/describe/:process', (req, res) => {
    if (req.params.process == undefined || req.params.process == null) return res.sendStatus(400);

    pm2.describe(req.params.process, (err, data) => {
        if (err) return res.send(err);
        res.send(data);
    })
});

app.get('/list', (req, res) => {
    pm2.list((err, list) => {
        if (err) return res.send(err);
        res.send(list);
    })
});

app.post('/signal', (req, res) => {
    if (req.body.signal == undefined || req.body.signal == null) return res.sendStatus(400);
    if (req.body.process == undefined || req.body.process == null) return res.sendStatus(400);

    pm2.sendSignalToProcessName(req.body.signal, req.body.process, (err, data) => {
        if (err) return res.send(err);
        res.send(data);
    })
});

pm2.connect((err) => {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    app.listen(8008, () => {}).on('error', () => {
        process.exit(0);
    });
});

exitHook(() => {
    pm2.disconnect();
    fs.unlinkSync(path.join(root, 'rpm2.proc'));
});
