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
                    {kind: "FittableColumns", components: [
                        {content: $L("Permanence: "), style: "color: white; line-height: 2.5rem;"},
                        {kind: "onyx.PickerDecorator", style: "margin-left: 1rem;", components: [
                            {},   // PickerButton
                            {name: "permanencePckr", kind: "onyx.Picker", components: [
                                {content: $L("Persistent"), active: true, value: window.PERSISTENT},
                                {content: $L("Temporary"), value: window.TEMPORARY}
                            ]}
                        ]}
                    ]},
                    {kind: "FittableColumns", style: "margin-top: 1rem;", components: [
                        {content: $L("Size: "), style: "color: white; line-height: 2rem;"},
                        {kind: "onyx.InputDecorator", style: "margin-left: 1rem;", components: [
                            {name: "sizeInpt", kind: "onyx.Input", type: "number", value: "1000000", attributes: {min: "0", step: "1000"}, style: "width: 7rem;"}
                        ]},
                        {content: $L("bytes"), style: "color: white; line-height: 2rem; margin-left: 1rem;"}
                    ]},
                    {kind: "onyx.Groupbox", style: "margin-top: 1rem;", components: [
                        {kind: "onyx.Button", style: "width: 100%", content: $L("webkitRequestFileSystem"), ontap: "requestWebkitChromeFileSystem"},
                        {name: "webkitChromeOut", content: " &nbsp; ", allowHtml: true, style: "padding: 5px; color: white"}
                    ]}
                ]}
            ]
        }
    ],

    requestWebkitChromeFileSystem: function (inSender, inEvent) {
        var panel = this;
        try {
            var permanence = this.$.permanencePckr.getSelected().value;
            var size = parseInt(this.$.sizeInpt.getValue(), 10);
            this.log(typeof permanence, permanence, typeof size, size);
            window.webkitRequestFileSystem(permanence, size, success, fail);
        } catch (err) {
            this.error(err);
            panel.$.webkitChromeOut.set('content',  errorToMessage(err));
        }

        function success(fileSystem) {
            console.log(fileSystem);
            var msg = [];
            if (fileSystem.name) {
                msg.push(fileSystem.name);
            }
            if (fileSystem.root) {
                msg.push(fileSystem.root.fullPath);
            }
            panel.$.webkitChromeOut.set('content',  msg.join('<br>'));
        }

        function fail(fileError) {
            console.error(fileError);
            panel.$.webkitChromeOut.set('content',  errorToMessage(fileError));
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

            if (msg.length === 0 && fallbackMsg) {
                msg.push(fallbackMsg);
            }

            return msg.join('<br>');
        }
    }
});