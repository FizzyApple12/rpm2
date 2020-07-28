<div align="center">
    <br/>
        <img src="https://fizzyapple12.com/files/github/rpm2.png" alt="rpm2 logo">
    <br/>
    <br/>
    <h2>Remote PM2</h2>
    <br/>
    <br/>
    <br/>
</div>

A simple daemonized wrapper for pm2 which exposes a web api for controlling pm2 remotely.

Note: the webserver runs on port 8008

## The API

Method | Endpoint | Data | Returns | Functional Equivalent
--- | --- | --- | --- | ---
POST | /start | (body json) process: The command or the process id to start | Process data or error | pm2 start [body.process]
POST | /stop | (body json) process: The process id to stop | Process data or error | pm2 stop [body.process]
POST | /restart | (body json) process: The process id to restart | Process data or error | pm2 restart [body.process]
POST | /delete | (body json) process: The process id to delete | Process data or error | pm2 delete [body.process]
GET | /describe/:process | (url) process: The process id to describe | Process data or error | pm2 describe [url.process]
GET | /list | none | Process data or error | pm2 list
POST | /signal | (body json) signal: The signal to send<br/>(body json) process: The process to send a signal to | Process data or error | pm2 sendSignal [body.signal] [body.process]