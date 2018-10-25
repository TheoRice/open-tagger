$(document).ready(function() {
    const electron = require('electron');
    const {
        ipcRenderer
    } = electron;
    window.fs = require('fs');

    var queue = [];


    $('#start-queue').click(function() {

        const xmlMOVI = writeXML();

        fs.writeFile('/tmp/xmlMOVI.txt', xmlMOVI, function (err) {
            if (err) throw err;
        });
        ipcRenderer.send(
            'video:submit',
            $('#vidFile')[0].files[0].path,
            $('#title')[0].value,
            $('#imgFile')[0].files[0].path,
            $('#description')[0].value,
            $('#year')[0].value,
            true,
            $('#directors')[0].value.replace("\n", "&"),
            $('#overwrite')[0].checked
        );
    });

    $('#add-queue').click(function() {
        var item = [writeXML()];
        item.push($('#vidFile')[0].files[0].path);
        item.push($('#title')[0].value, );
        item.push($('#imgFile')[0].files[0].path);
        item.push($('#description')[0].value);
        item.push($('#year')[0].value);
        item.push(true);
        item.push($('#directors')[0].value.replace("\n", "&"));
        item.push($('#overwrite')[0].checked);

        queue.push(item);
    });

    $('#imgFile').change(function() {
        readURL(this);
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#poster-img').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function writeMultipleNamesToXML(arr, type) {
        namesXML = `\n\t<key>${type}</key>\n\t<array>`;

        for (var i = 0; i < arr.length; i++) {
            namesXML = namesXML + `\n\t\t<dict>
            \t\t<key>name</key>
            \t\t<string>${arr[i]}</string>
        \t</dict>`;
        }

        namesXML = namesXML + `
    \t</array>`;
        return namesXML;
    }

    function writeXML() {
        var xmlfile = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>`;

        // retrieve and parse cast information
        var cast = $('#cast')[0].value.split('\n');
        xmlfile = xmlfile + writeMultipleNamesToXML(cast, 'cast');

        // retrieve and parse directors information
        var directors = $('#directors')[0].value.split('\n');
        xmlfile = xmlfile + writeMultipleNamesToXML(directors, 'directors');

        // retrieve and parse producers information
        var producers = $('#producers')[0].value.split('\n');
        xmlfile = xmlfile + writeMultipleNamesToXML(producers, 'producers');

        // retrieve and parse screen writers information
        var screenwriters = $('#screenwriters')[0].value.split('\n');
        xmlfile = xmlfile + writeMultipleNamesToXML(screenwriters, 'screenwriters');

        // retrieve studio information
        const studio = $('#studio')[0].value;
        xmlfile = xmlfile + `\n\t<key>studio</key>\n\t<string>${studio}</string>`;
        xmlfile = xmlfile + `
</dict>
</plist>`;
        return xmlfile;
    }
});