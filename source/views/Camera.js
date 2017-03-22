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
            {kind: "onyx.Button", content: $L("Activate camera"), ontap: "activateCamera"},
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
                        {name: "videoTextOut", content: " &nbsp; ", allowHtml: true, style: "padding: 5px; color: white"}
                    ]}
                ]}
			]
		}
	],

	create: function () {
		this.inherited(arguments);
        var videoTextOut = this.$.videoTextOut;
        videoTextOut.set('content', "typeof navigator.mediaDevices: " + (typeof navigator.mediaDevices));
        if (navigator.mediaDevices) {
            videoTextOut.set('content', videoTextOut.get('content') + "<br>typeof navigator.mediaDevices.getUserMedia: " + (typeof navigator.mediaDevices.getUserMedia));
        }
	},

    activateCamera: function (inSender, inEvent) {
		this.log(navigator.mediaDevices);
		if (! navigator.mediaDevices) {
            this.notifyUser($L("No camera API (navigator.mediaDevices)"));
            return;
        }
        var videoElem = this.$.video.hasNode();
        var videoTextOut = this.$.videoTextOut;
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function(stream) {
                videoTextOut.set('content', videoTextOut.get('content') + '<br>' + "stream: " + stream);
                videoElem.srcObject = stream;
                videoElem.play();
            })
            .catch(function(err) {
                console.log("An error occured! " + err);
                videoTextOut.set('content', videoTextOut.get('content') + '<br>' + "An error occured! " + err);
            });

		var streaming = false;
        var canvasElem = this.$.canvas.hasNode();
        var cameraPane = this;
		videoElem.addEventListener('canplay', function(ev){
            if (!streaming) {
                cameraPane.height = videoElem.videoHeight / (videoElem.videoWidth/cameraPane.width);

                videoElem.setAttribute('width', cameraPane.width);
                videoElem.setAttribute('height', cameraPane.height);
                canvasElem.setAttribute('width', cameraPane.width);
                canvasElem.setAttribute('height', cameraPane.height);
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
        var videoTextOut = this.$.videoTextOut;
        var context = this.$.canvas.hasNode().getContext('2d');
        if (this.width && this.height) {
            this.$.canvas.hasNode().width = this.width;
            this.$.canvas.hasNode().height = this.height;
            context.drawImage(this.$.video.hasNode(), 0, 0, this.width, this.height);

            var data = this.$.canvas.hasNode().toDataURL('image/png');
            this.$.photo.hasNode().setAttribute('src', data);

            videoTextOut.set('content', videoTextOut.get('content') + '<br>' + data.slice(0,35) + "...");
        } else {
        	this.notifyUser($L("Activating camera"));
            this.activateCamera(inSender, inEvent);
        }
    },

	notifyUser: function (msg) {
        this.warn(msg);
        var videoTextOut = this.$.videoTextOut;
        videoTextOut.set('content', videoTextOut.get('content') + '<br>' + msg);
        if (window.PalmSystem) {
            PalmSystem.addBannerMessage(msg, '{}', undefined, "alerts");
        } else {
            alert(msg);
        }
	}
});
