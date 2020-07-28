const childProcess = require('child_process');
const path = require("path");
const os = require("os");
const root = (os.platform == "win32") ? process.cwd().split(path.sep)[0] : "/";
const fs = require('fs');

const commands = {
    help: [ args => {
        Object.entries(commands).forEach(command => {
            console.log(`${command[0]}: ${command[1][1]}`);
            console.log(`\tusage: "rpm2 ${command[1][2]}"`);
        });
    }, "List all rpm2 commands.", "help" ],

    start: [ args => {
        if (fs.existsSync(path.join(root, 'rpm2.proc'))) return console.log('Cannot spawn more than one daemon process.');

        console.log('Starting new daemon process...');
        var child = childProcess.spawn('node', [ require.resolve('./daemon.js') ], { 
            detached: true, 
            stdio: [ 
                'ignore', 
                'ignore', 
                'ignore' 
            ] 
        });
        child.unref();
        while (!fs.existsSync(path.join(root, 'rpm2.proc'))) {}
        console.log(`Started daemon process ${fs.readFileSync(path.join(root, 'rpm2.proc'))} successfully!`);
    }, "Start the rpm2 daemon.", "start" ],

    stop: [ args => {
        if (!fs.existsSync(path.join(root, 'rpm2.proc'))) return console.log('Cannot kill a daemon process which doesn\'t exist.');
        var pid = parseInt(fs.readFileSync(path.join(root, 'rpm2.proc')));
        
        console.log(`Killing process ${pid}...`);
        try {
            process.kill(pid);
            console.log(`Killed process ${pid} successfully!`);
            if (fs.existsSync(path.join(root, 'rpm2.proc'))) fs.unlinkSync(path.join(root, 'rpm2.proc'));
        } catch (e) {
            console.log(`Failed to kill process ${pid}:`);
            console.log(e);
            if (fs.existsSync(path.join(root, 'rpm2.proc'))) fs.unlinkSync(path.join(root, 'rpm2.proc'));
        }
    }, "Stop the rpm2 daemon.", "stop" ],
}

module.exports = () => {
    var arguments = process.argv;
    arguments = arguments.splice(2);

    if (!arguments[0] || !commands[arguments[0]]) return console.log('invalid command, please run "rpm2 help"');

    commands[arguments[0]][0](arguments.splice(1));
}