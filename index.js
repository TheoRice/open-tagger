const electron = require('electron');
const {spawn} = require('child_process');

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


ipcMain.on('video:submit', (event, path, title, image, desc, longDesc, year) => {
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

    // Overwrite previous file
    cmd = cmd.concat([`--overWrite`]);
    console.log(cmd);
    run(cmd);
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
function run(arguments) {
    var ap = spawn('AtomicParsley', arguments);
    receiveSTD(ap);
};