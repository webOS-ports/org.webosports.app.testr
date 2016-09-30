/**
 * Created by doug on 9/17/16.
 */

enyo.kind({
    name: "FileApis",
    layoutKind: "FittableRowsLayout",
    components: [
        { kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
            {fit: true, content: $L("File APIs")}
        ]},
        {
            fit: true,
            kind: "Scroller",
            touch: true,
            horizontal: "hidden",
            components: [
                {style: "margin-left: auto; margin-right: auto; max-width: 35em; padding: 1rem;", components: [
                    // {kind: "FittableColumns", components: [
                    //     {content: $L("Permanence: "), style: "color: white; line-height: 2.5rem;"},
                    //     {kind: "onyx.PickerDecorator", style: "margin-left: 1rem;", components: [
                    //         {},   // PickerButton
                    //         {name: "permanencePckr", kind: "onyx.Picker", components: [
                    //             {content: $L("Persistent"), active: true, value: window.PERSISTENT},
                    //             {content: $L("Temporary"), value: window.TEMPORARY}
                    //         ]}
                    //     ]}
                    // ]},
                    {kind: "FittableColumns", style: "margin-top: 1rem;", components: [
                        {content: $L("Size: "), style: "color: white; line-height: 2rem;"},
                        {kind: "onyx.InputDecorator", style: "margin-left: 1rem;", components: [
                            {name: "sizeInpt", kind: "onyx.Input", type: "number", value: "200000", attributes: {min: "0", step: "100000"}, style: "width: 11rem;"}
                        ]},
                        {content: $L("bytes"), style: "color: white; line-height: 2rem; margin-left: 1rem;"}
                    ]},
                    {kind: "onyx.Groupbox", style: "margin-top: 1rem;", components: [
                        {kind: "onyx.Button", style: "width: 100%", content: $L("Chrome sandbox - write file"), ontap: "chromeSandboxWriteFile"},
                        {name: "webkitChromeOut", content: " &nbsp; ", allowHtml: true, style: "padding: 5px; color: white"}
                    ]}
                ]}
            ]
        }
    ],

    chromeSandboxWriteFile: function (inSender, inEvent) {
        var panel = this;
        var requestedBytes;
        try {
            requestedBytes = parseInt(this.$.sizeInpt.getValue(), 10);
            this.log(typeof requestedBytes, requestedBytes);
            var msg = "requesting " + requestedBytes + " bytes persistent storage:";
            panel.$.webkitChromeOut.set('content', msg);

            navigator.webkitPersistentStorage.requestQuota(requestedBytes, gotQuota, fileSystemFail);

            // var permanence = this.$.permanencePckr.getSelected().value;
            // this.log(typeof permanence, permanence, typeof requestedBytes, requestedBytes);
            // window.webkitRequestFileSystem(permanence, requestedBytes, success, fileSystemFail);
        } catch (err) {
            this.error(err);
            panel.$.webkitChromeOut.set('content',  errorToMessage(err));
        }

        function gotQuota(grantedBytes) {
            console.log("got FileSystem quota:", grantedBytes);
            var msg = "granted " + grantedBytes + " bytes";
            msg += "<br><br>requesting file system:"
            panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + msg);

            window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, gotFileSystem, fileSystemFail);
        }
        function gotFileSystem(fileSystem) {
            console.log(fileSystem);
            var msg = [];
            msg.push("name: " + fileSystem.name);
            if (fileSystem.root) {
                msg.push("root: " + fileSystem.root.fullPath);
            }
            msg.push("<br>getting directory:");
            panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + msg.join('<br>'));

            fileSystem.root.getDirectory('test directory', {create: true}, gotDirectory, fileSystemFail);
        }
        function gotDirectory(dirEntry) {
            console.log(dirEntry);
            var msg = "path: " + dirEntry.fullPath;
            msg += "<br><br>getting file:"
            panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + msg);

            var filePath = "test file.txt";
            dirEntry.getFile(filePath, {create: true, exclusive: false}, gotFile, fileSystemFail);
        }
        function gotFile(fileEntry) {
            console.log(fileEntry);
            var msg = "path: " + fileEntry.fullPath;
            msg += "<br><br>creating fileWriter:"
            panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + msg);

            fileEntry.createWriter(gotFileWriter, fileSystemFail);

            function gotFileWriter(fileWriter) {
                console.log(fileWriter);
                var msg = "length " + fileWriter.length;

                var strArr = [];
                while ((strArr.length+1) * 100 <= requestedBytes) {
                    strArr.push("........10........20........30........40........50........60........70........80........90......100\n");
                }
                var blob = new Blob(strArr, {type: "text/plain"});

                msg += "<br><br>writing " + blob.size + " bytes:";
                panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + msg);

                fileWriter.onwriteend = gotTruncatedFile;
                fileWriter.onerror = fileSystemFail;
                fileWriter.truncate(0);

                function gotTruncatedFile(progressEvt) {
                    fileWriter.onwriteend = function(progressEvt) {
                        var msg = "wrote " + fileWriter.position + " bytes to " + fileEntry.fullPath;
                        console.log(msg);
                        panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + msg);
                    };

                    fileWriter.write(blob);
                }
            }
        }

        function fileSystemFail(fileError) {
            console.error(fileError);
            panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + errorToMessage(fileError) + '<br>');
        }

        function errorToMessage(error, fallbackMsg) {
            var msg = [];
            if (! error) {
                if (fallbackMsg) {
                    return fallbackMsg;
                } else {
                    return Object.prototype.toString.call(error);
                }
            }
            if (error.code) {
                if (typeof error.code === 'number') {
                    for (var propName in error) {
                        if (propName !== 'code' && error[propName] === error.code) {
                            msg.push(propName);
                        }
                    }
                }
                if (msg.length === 0) {
                    msg.push(error.code);
                }
            }
            if (error.message) {
                msg.unshift(error.message);
            }
            if (error.name) {
                msg.unshift(error.name);
            }

            if (error instanceof ProgressEvent) {
                msg.push("ProgressEvent");
                msg.push("type: " + error.type);
                msg.push("total: " + error.total);
                msg.push("loaded: " + error.loaded);
            }

            if (msg.length === 0) {
                if (fallbackMsg) {
                    msg.push(fallbackMsg);
                } else {
                    try {
                        msg.push(JSON.stringify(error));
                    } catch (e) {
                        console.error(e);
                    }
                }
            }

            return msg.join('<br>');
        }
    }
});