/* Camera.js - panel for manual tests of HTML5 camera API (navigator.mediaDevices)
 * Copyright © 2017 by P. Douglas Reeder under the MIT License
 * based on https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos */

enyo.kind({
	name: "Camera",
	layoutKind: "FittableRowsLayout",
	width: 320,
	height: 0,
	components: [
	    { kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
	        {fit: true, content: $L("Camera")},
            {kind: "onyx.Button", content: $L("Activate rear"), ontap: "activateCamera"},
            {kind: "onyx.Button", content: $L("Take photo"), ontap: "takePhoto"}
        ]},
		{
			fit: true,
			kind: "Scroller",
			touch: true,
			horizontal: "hidden",
			components: [
				{style: "margin-left: auto; margin-right: auto; max-width: 35em; padding: 1rem;", components: [
					{name: 'video', id:'video', tag: 'video', content: "Video Stream not available."},
					{name: 'canvas', id: 'canvas', tag: 'canvas'},
					{name: 'photo', id:"photo", tag: 'img', attributes:{alt:"The screen capture will appear in this box."}},
                    {kind: "onyx.Groupbox", style: "margin-top: 1rem;", components: [
                        {name: "videoTextOut", content: " ", allowHtml: true, style: "padding: 5px; color: white"}
                    ]}
                ]}
			]
		}
	],

	create: function () {
		this.inherited(arguments);
        var cameraPane = this;
        if (! navigator.mediaDevices) {
            this.textOut("typeof navigator.mediaDevices: " + (typeof navigator.mediaDevices));
        }

        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
                devices.forEach(function(device) {
                	cameraPane.log(JSON.stringify(device));
                	if (device.deviceId !== 'default') {
                		var msg = device.kind + ": " + device.label +
                            " id=" + device.deviceId.slice(0,6) + "...";
                		if (device.groupId) {
                			msg += " groupId=" + device.groupId.slice(0,6) + "...";
						}
                        cameraPane.textOut(msg);
                    }
                });
			}).catch(function (err) {
				cameraPane.textOut(err);
			})
        }
	},

    activateCamera: function (inSender, inEvent) {
		this.log(navigator.mediaDevices);
		if (! navigator.mediaDevices) {
            this.banner($L("No camera API (navigator.mediaDevices)"));
            return;
        }
        var cameraPane = this;
        var videoElem = this.$.video.hasNode();
        navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}, audio: false })
            .then(function(stream) {
                cameraPane.textOut("stream: " + stream);
                videoElem.srcObject = stream;
                videoElem.play();
            })
            .catch(function(err) {
                cameraPane.textOut("An error occured! " + err);
            });

		var streaming = false;
		videoElem.addEventListener('canplay', function(ev){
            cameraPane.textOut("videoHeight="+videoElem.videoHeight + "   videoWidth="+videoElem.videoWidth);
            if (!streaming) {
                if (videoElem.videoWidth > 0) {
                    cameraPane.height = videoElem.videoHeight / (videoElem.videoWidth / cameraPane.width);
                    cameraPane.textOut("height=" + cameraPane.height + "   width=" + cameraPane.width);

                    cameraPane.$.video.applyStyle('height', cameraPane.height + 'px');
                    cameraPane.$.video.applyStyle('width', cameraPane.width + 'px');
                    cameraPane.$.canvas.applyStyle('height', cameraPane.height + 'px');
                    cameraPane.$.canvas.applyStyle('width', cameraPane.width + 'px');
                    cameraPane.$.photo.applyStyle('height', cameraPane.height + 'px');
                    cameraPane.$.photo.applyStyle('width', cameraPane.width + 'px');
                }
                streaming = true;

                cameraPane.clearphoto();
            }
        }, false);
	},

    clearphoto: function () {
		var context = this.$.canvas.hasNode().getContext('2d');
		context.fillStyle = "#AAA";
		context.fillRect(0, 0, this.$.canvas.hasNode().width, this.$.canvas.hasNode().height);

		var data = this.$.canvas.hasNode().toDataURL('image/png');
        this.$.photo.hasNode().setAttribute('src', data);
	},

    takePhoto: function (inSender, inEvent) {
		this.log();
        var context = this.$.canvas.hasNode().getContext('2d');
        if (this.width && this.height) {
            this.$.canvas.hasNode().width = this.width;
            this.$.canvas.hasNode().height = this.height;
            context.drawImage(this.$.video.hasNode(), 0, 0, this.width, this.height);

            var data = this.$.canvas.hasNode().toDataURL('image/png');
            this.$.photo.hasNode().setAttribute('src', data);

            this.textOut(data.slice(0,35) + "...");
        } else {
        	this.banner($L("Activating camera"));
            this.activateCamera(inSender, inEvent);
        }
    },

	banner: function (msg) {
        this.textOut(msg);
        if (window.PalmSystem) {
            PalmSystem.addBannerMessage(msg, '{}', undefined, "alerts");
        } else {
            alert(msg);
        }
	},
	textOut: function (msg) {
        this.log(msg);
        var videoTextOut = this.$.videoTextOut;
        videoTextOut.set('content', videoTextOut.get('content') + msg + '<br>');
	}
});
