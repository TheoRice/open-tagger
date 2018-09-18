const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const {spawn} = require('child_process');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});


// title: title
// author: director
// year: year
// comment: description

// todo:
// images don't work

ipcMain.on('video:submit', (event, path, title, image, desc) => {

    // ffmpeg(path)
    //     .inputOptions(`-i ${image}`)
    //     .outputOptions(
    //         '-map', '0:0',
    //         '-map', '1:0',
    //         '-c', 'copy',
    //         '-id3v2_version', '4',
    //         '-metadata', `title=${title}`,
    //         '-metadata', `comment=${desc}`
    //     )
    //     .save('test.mp4')
    //     .on('start', function (cmdline) {
    //         console.log('Command line: ' + cmdline);
    //     });

    if (image) {
        changeArtwork(path, image);
    }
    
})

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

function changeArtwork(filePath, imgPath) {
    var ap = spawn('AtomicParsley', [filePath, `--artwork`, `REMOVE_ALL`, `--artwork`, imgPath, `--overWrite`]);
    receiveSTD(ap);
};