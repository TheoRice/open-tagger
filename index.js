const electron = require('electron');
const {spawn, exec} = require('child_process');
// const exec = require('child_process').exec;

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});


/*
    4char code      Name                Description
    @nam            Title               movie title
    @ART            Album Artist        director
    @wrt            Composer            composer
    @gen            Genre               genres
    @day            Year                release date format: XXXX-YY-ZZ
    @xpd
    desc            Description         short movie description
    ldes            LongDesc            long movie description
    sonm            Studio              studio
    covr            Artwork             cover art
*/

// for ratings and cast info
// AtomicParsley filePath --rDNSatom "content" name=iTunEXTC domain=com.apple.iTunes


ipcMain.on('video:submit', (event, path, title, image, desc, longDesc, year, xmlMOVI, overwrite) => {
    var cmd = [path];

    if (title) {
        cmd = cmd.concat([`--title`, title]);
    }

    if (image) {
        cmd = cmd.concat([`--artwork`, `REMOVE_ALL`, `--artwork`, image]);
    }

    if (desc) {
        cmd = cmd.concat([`--description`, desc]);
    }

    if (longDesc) {
        cmd = cmd.concat([`--longdesc`, longDesc]);
    }

    if (year) {
        cmd = cmd.concat([`--year`, year]);
    }

    if (xmlMOVI) {
        cmd = cmd.concat([`--rDNSatom`, `XMLFILE`, `name=iTunMOVI`, `domain=com.apple.iTunes`]);
    }

    // Overwrite previous file
    if (overwrite) {
        cmd = cmd.concat([`--overWrite`]);
    }

    run(cmd, xmlMOVI);
})

// Display progress information and errors to terminal
function receiveSTD(ap) {
    ap.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ap.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    ap.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

// Run AtomicParsley command
function run(arguments, xmlMOVI) {
    if (xmlMOVI) {
        exec(`cat "/tmp/xmlMOVI.txt"`, (error, stdout, stderr) => {
            if (error) console.log(error);
            if (stderr) console.log(stderr);
            arguments[arguments.length-3] = stdout;
            var ap = spawn('AtomicParsley', arguments);
            receiveSTD(ap);
        });
    } else {
        var ap = spawn('AtomicParsley', arguments);
        receiveSTD(ap);
    }
};