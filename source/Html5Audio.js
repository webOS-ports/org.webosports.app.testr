enyo.kind({
	name: "enyo.Audio",
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
		this.setAttribute("type", "audio/wav");
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
				{tag: "div", style: "padding: 35px 10% 35px 10%;", components: [
					{kind: "onyx.Groupbox", components: [
					    {kind: "onyx.GroupboxHeader", content: "Sounds"},
						{components: [
							{content: "Clicking the button below will play a alarm audio sound to verify that HTML 5 Audio support is working correctly. If you don't hear anything the test has failed.", style: "padding: 5px; color: white"},
							{name: "AudioPlayer", kind: "enyo.Audio", preload: false, src: "file:///usr/palm/sounds/alert.wav"},
							{kind: "onyx.Button", style: "width: 100%", content: "Play", ontap: "playAudio"}
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
	playAudio: function () {
		this.$.AudioPlayer.play();
	}
});
