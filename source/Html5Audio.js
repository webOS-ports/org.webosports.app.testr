enyo.kind({
	name: "testr.Audio",
	kind: "Control",
	published: {
		src: "",
		preload: true
	},
	tag: "audio",
	create: function() {
		this.inherited(arguments);
		this.srcChanged();
		this.preloadChanged();
	},
	srcChanged: function() {
		
		var path = enyo.path.rewrite(this.src);
		this.setAttribute("src", path);
		//Type needs to be set based on the filetype. Assuming for now it's always wav or mp3, so last 3 chars should work (though a bit dirty)
		this.setAttribute("type", "audio/"+path.substring(path.length-3));
	},
	preloadChanged: function() {
		this.setAttribute("autobuffer", this.preload ? "autobuffer" : null);
		this.setAttribute("preload", this.preload ? "preload" : null);
	},
	play: function() {
		if (this.hasNode()) {
			if (!this.node.paused) {
				this.node.currentTime = 0;
			} else {
				this.node.play();
			}
		}
	}
});

enyo.kind({
	name: "Html5Audio",
	layoutKind: "FittableRowsLayout",
	palm: false,
	components:[
		{kind: "Signals", ondeviceready: "deviceready"},
		{
			kind: "onyx.Toolbar",
			style: "line-height: 36px;",
			components:[
				{ content: "HTML5 Audio Test" },
			]
		},
		{
			kind: "Scroller",
			touch: true,
			horizontal: "hidden",
			fit: true,
			components: [
				{style: "margin-left: auto; margin-right: auto; max-width: 35em; padding: 1rem;", components: [
					{kind: "onyx.Groupbox", components: [
					    {kind: "onyx.GroupboxHeader", content: "Sounds"},
						{components: [
							{content: "Clicking the button below will play a alarm audio sound in WAV-format to verify that HTML 5 Audio support is working correctly. If you don't hear anything the test has failed.", style: "padding: 5px; color: white"},
							{name: "AudioPlayerWAV", kind: "testr.Audio", preload: false, src: "file:///usr/palm/sounds/alert.wav"},
							{kind: "onyx.Button", style: "width: 100%", content: "Play WAV", ontap: "playAudio(\"WAV\")"},
							{content: "Clicking the button below will play a ringtone audio sound in MP3-format to verify that HTML 5 Audio support is working correctly. If you don't hear anything the test has failed.", style: "padding: 5px; color: white"},
							{name: "AudioPlayerMP3", kind: "testr.Audio", preload: false, src: "file:///usr/palm/sounds/ringtone.mp3"},
							{kind: "onyx.Button", style: "width: 100%", content: "Play MP3", ontap: "playAudio"}
						]},
					]},
				]}
			]
		},
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		if(!window.PalmSystem)
			enyo.log("Non-palm platform, service requests disabled.");
	},
	deviceready: function(inSender, inEvent) {
		this.inherited(arguments);
		this.palm = true;
	},
	playAudioWAV: function () {
		this.$.AudioPlayerWAV.play();
	},
	playAudioMP3: function () {
		this.$.AudioPlayerMP3.play();
	}

});
