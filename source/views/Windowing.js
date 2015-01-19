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
					    {kind: "onyx.GroupboxHeader", content: "Window tests"},
						{components: [
							{content: "Clicking the button below will open a new window with this app loaded into", style: "padding: 5px; color: white"},
							{kind: "onyx.Button", style: "width: 100%", content: "Open window", ontap: "openWindow"}
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
});
