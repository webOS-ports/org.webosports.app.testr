enyo.kind({
	name: "Notifications",
	layoutKind: "FittableRowsLayout",
	palm: false,
	currentNotificationId: 0,
	components:[
		{kind: "Signals", ondeviceready: "deviceready"},
		{
			kind: "onyx.Toolbar",
			style: "line-height: 36px;",
			components:[
				{ content: "Notifications" },
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
					    {kind: "onyx.GroupboxHeader", content: "Banner notifications"},
						{components: [
							{content: "Raise/close a simple banner notification", style: "padding: 5px; color: white"},
							{kind: "onyx.Button", style: "width: 100%", content: "Add", ontap: "createBannerNotification"},
							{kind: "onyx.Button", style: "width: 100%", content: "Remove", ontap: "removeBannerNotification"},
							{kind: "onyx.Button", style: "width: 100%", content: "Close all", ontap: "closeAllBannerNotifications"}
						]},
					]},

				]}
			]
		},
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);

		if (!window.PalmSystem) {
			enyo.log("Non-palm platform, service requests disabled.");
			return;
		}

		this.palm = true;
	},
	createBannerNotification: function() {
		if (!this.palm)
			return;

		this.currentNotificationId = PalmSystem.addBannerMessage("Test banner message", { }, "", "", 0, false);
	},
	removeBannerNotification: function() {
		if (this.currentNotificationId == 0)
			return;

		PalmSystem.removeBannerMessage(this.currentNotificationId);
		this.currentNotificationId = 0;
	},
	closeAllBannerNotifications: function() {
		PalmSystem.clearBannerMessages();
	}
});
