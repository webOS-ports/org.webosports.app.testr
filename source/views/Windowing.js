enyo.kind({
	name: "Windowing",
	layoutKind: "FittableRowsLayout",
	palm: false,
	components:[
		{kind: "Signals", ondeviceready: "deviceready"},
		{
			kind: "onyx.Toolbar",
			style: "line-height: 36px;",
			components:[
				{ content: "Windowing tests" },
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
					    {kind: "onyx.GroupboxHeader", content: "window.open()"},
						{components: [
							{content: "Clicking the button below will open a new window with this app loaded into", style: "padding: 5px; color: white"},
							{kind: "onyx.Button", style: "width: 100%", content: "Open window", ontap: "openWindow"}
						]},
					]},

				]},
				{style: "padding: 35px 10% 35px 10%;", components: [
					{kind: "onyx.Groupbox", components: [
					    {kind: "onyx.GroupboxHeader", content: "window.postMessage()"},
						{components: [
							{content: "Clicking the button below will send a message to the iframe", style: "padding: 5px; color: white"},
							{kind: "onyx.Button", style: "width: 100%", content: "Post Message", ontap: "postMessage"},
							{name: "receiverFrame", tag: "iframe", attributes: {src: "receiver.html"}, style: "width: 100%; box-sizing: border-box; background-color: lightYellow;"}
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
	openWindow: function() {
		window.open("file:///usr/palm/applications/org.webosports.app.testr/index.html");
	},
	postMessage: function (inSender, inEvent) {
		var receiverIFrame = this.$.receiverFrame.hasNode();
		this.log();
		receiverIFrame.contentWindow.postMessage("Hello from the main window.", "*");
	}
});
