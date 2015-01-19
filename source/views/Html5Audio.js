
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
							{name: "AudioPlayer",
							kind: "enyo.Audio",
							preload: false, 
							src: "file:///usr/palm/sounds/alert.wav"
						//	src: "http://www.noiseaddicts.com/samples/134.mp3"
							},
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
