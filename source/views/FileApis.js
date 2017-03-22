/**
 * Created by doug on 9/17/16.
 */

enyo.kind({
    name: "FileApis",
    layoutKind: "FittableRowsLayout",
    components: [
        { kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
            {fit: true, content: $L("File APIs")},
            {content: $L("origin: ") + location.origin}
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
                    ]},
                    {kind: "onyx.Groupbox", style: "margin-top: 1rem;", components: [
                        {kind: "onyx.Button", style: "width: 100%", content: $L("Chrome sandbox - delete all"), ontap: "chromeSandboxDeleteAll"},
                        {name: "sandboxDeleteOut", content: " &nbsp; ", allowHtml: true, style: "padding: 5px; color: white"}
                    ]}
                ]}
            ]
        }
    ],

    chromeSandboxWriteFile: function (inSender, inEvent) {
        var panel = this;
        var targetBytes;
        try {
            targetBytes = parseInt(this.$.sizeInpt.getValue(), 10);
            var requestedBytes = Math.round(targetBytes * 1.01);
            var msg = "requesting " + requestedBytes + " bytes persistent storage:";
            this.log(msg);
            panel.$.webkitChromeOut.set('content', msg);

            navigator.webkitPersistentStorage.requestQuota(requestedBytes, gotQuota, fileSystemFail);

            // var permanence = this.$.permanencePckr.getSelected().value;
            // this.log(typeof permanence, permanence, typeof targetBytes, targetBytes);
            // window.webkitRequestFileSystem(permanence, requestedBytes, success, fileSystemFail);
        } catch (err) {
            this.error(err);
            panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + panel.errorToMessage(err));
        }

        function gotQuota(grantedBytes) {
            console.log("got FileSystem quota:", grantedBytes);
            var msg = "granted " + grantedBytes + " bytes";
            msg += "<br><br>requesting file system:";
            panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + msg);

            window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, gotFileSystem, fileSystemFail);
        }
        function gotFileSystem(fileSystem) {
            console.log(fileSystem);
            var msg = [];
            msg.push("name: " + fileSystem.name);
            msg.push("<br>getting directory:");
            panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + msg.join('<br>'));

            fileSystem.root.getDirectory('Testr', {create: true}, gotDirectory, fileSystemFail);
        }
        function gotDirectory(dirEntry) {
            console.log(dirEntry);
            var msg = "path: " + dirEntry.fullPath;
            msg += "<br><br>getting file:"
            panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + msg);

            var filePath;
            var appInfo = webos.fetchAppInfo();
            if (appInfo && appInfo.id) {
                filePath = appInfo.id + ".txt";
            } else {
                filePath = "unknown_id.txt";
            }
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
                while ((strArr.length+1) * 100 <= targetBytes) {
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
            panel.$.webkitChromeOut.set('content', panel.$.webkitChromeOut.get('content') + '<br>' + panel.errorToMessage(fileError) + '<br>');
        }
    },

    chromeSandboxDeleteAll: function (inSender, inEvent) {
        var panel = this;
        var dirReader;
        var totalEntries = 0;
        try {
            var msg = "requesting filesystem:";
            this.log(msg);
            panel.$.sandboxDeleteOut.set('content', msg);

            window.webkitRequestFileSystem(window.PERSISTENT, 1024, gotFileSystem, fileSystemFail);
        } catch (err) {
            this.error(err);
            panel.$.sandboxDeleteOut.set('content', panel.$.sandboxDeleteOut.get('content') + '<br>' + panel.errorToMessage(err));
        }

        function gotFileSystem(fileSystem) {
            console.log(fileSystem);
            var msg = [];
            msg.push("name: " + fileSystem.name);
            msg.push("<br>reading root directory:");
            panel.$.sandboxDeleteOut.set('content', panel.$.sandboxDeleteOut.get('content') + '<br>' + msg.join('<br>'));

            dirReader = fileSystem.root.createReader();
            dirReader.readEntries(gotEntries, fileSystemFail);
        }
        function gotEntries(entries) {
            console.log(entries);
            totalEntries += entries.length;
            var msg = [];
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.isDirectory){
                    console.log('recursively removing: ' + entry.fullPath);
                    msg.push('recursively removing: ' + entry.fullPath);
                    entry.removeRecursively(removedEntry, fileSystemFail);
                }
                else if (entry.isFile){
                    console.log('removing: ' + entry.fullPath);
                    msg.push('removing: ' + entry.fullPath);
                    entry.remove(removedEntry, fileSystemFail);
                }
            }
            panel.$.sandboxDeleteOut.set('content', panel.$.sandboxDeleteOut.get('content') + '<br>' + msg.join('<br>'));

            if (entries.length > 0) {
                dirReader.readEntries(gotEntries, fileSystemFail);
            } else {
                var msg2 = 'attempted removal of ' + totalEntries + ' entries';
                panel.$.sandboxDeleteOut.set('content', panel.$.sandboxDeleteOut.get('content') + '<br>' + msg2);
            }
        }
        function removedEntry() {
            var msg = "entry removed";
            console.log(msg);
            panel.$.sandboxDeleteOut.set('content', panel.$.sandboxDeleteOut.get('content') + '<br>' + msg);
        }

        function fileSystemFail(fileError) {
            console.error(fileError);
            panel.$.sandboxDeleteOut.set('content', panel.$.sandboxDeleteOut.get('content') + '<br>' + panel.errorToMessage(fileError) + '<br>');
        }
    },

    errorToMessage: function errorToMessage(error, fallbackMsg) {
        var msg = [];
        if (! error) {
            if (fallbackMsg) {
                return fallbackMsg;
            } else {
                return Object.prototype.toString.call(error);
            }
        }
        if (error.message) {
            msg.unshift(error.message);
        }
        if (error.name) {
            msg.unshift(error.name);
        }

        if (error instanceof ProgressEvent) {
            if (error.type === "error" && error.target.error) {
                msg.push(errorToMessage(error.target.error));
            } else {
                msg.push("ProgressEvent");
                msg.push("type: " + error.type);
                msg.push("total: " + error.total);
                msg.push("loaded: " + error.loaded);
            }
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

});
