enyo.kind({
	name: "Notifications",
	layoutKind: "FittableRowsLayout",
	palm: false,
	currentNotificationId: 0,
	dashboardCount: 0,
	components:[
		{kind: "Signals", ondeviceready: "deviceready"},
		{
			kind: "onyx.Toolbar",
			style: "line-height: 36px;",
			components:[
				{ content: "Notifications" }
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
					    {kind: "onyx.GroupboxHeader", content: "Banner notifications"},
						{components: [
							{content: "Should raise/close a transient banner notification, with alert sound." +
								" Should not add an icon to the notification bar, nor create a persistent dashboard." +
								" Dashboards should be closed, if open.", style: "padding: 5px; color: white"},
							{kind: "onyx.Button", style: "width: 100%", content: "Add", ontap: "createBannerNotification"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Remove", ontap: "removeBannerNotification"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Close all", ontap: "closeAllBannerNotifications"}
						]}
					]},

					{kind: "onyx.Groupbox", components: [
						{kind: "onyx.GroupboxHeader", content: "Dashboard notifications"},
						{components: [
							{content: "Should add an icon to the notification bar." +
								" Tapping any icon should display all dashboards, including one(s) for this app." +
								" Dashboards should persist until dismissed by user (or self-dismissed), even if this card is dismissed." +
								" Tapping the dashboard should redisplay this card, if it has been dismissed.",
								style: "padding: 5px; color: white"},
							{kind: "onyx.Button", style: "width: 100%", content: "Add default height dash", ontap: "createDashboardNotification"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Add 104px height dash", ontap: "createDashboardNotificationPixel"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Add 11 gridunit height dash", ontap: "createDashboardNotificationGridunit"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Add clickableWhenLocked default height dash", ontap: "createDashboardNotificationClickableWhenLocked"}
						]}
					]}
				]}
			]
		}
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

		this.log();
		this.currentNotificationId = PalmSystem.addBannerMessage("Testr banner message", '{ }', "assets/Contacts-favorites-star-blue.png", "alerts");
	},
	removeBannerNotification: function() {
		if (this.currentNotificationId === 0)
			return;

		this.log(this.currentNotificationId);
		PalmSystem.removeBannerMessage(this.currentNotificationId);
		this.currentNotificationId = 0;
	},
	closeAllBannerNotifications: function() {
		this.log();
		PalmSystem.clearBannerMessages();
	},

	createDashboardNotification: function() {
		++this.dashboardCount;
		this.log("dashboard.html", this.dashboardCount);
		window.open("dashboard.html?count="+this.dashboardCount, "Testr Default Dashboard", 'attributes={"window":"dashboard"}');
	},
	createDashboardNotificationPixel: function() {
		++this.dashboardCount;
		this.log("dashboard.html", this.dashboardCount);
		window.open("dashboard.html?count="+this.dashboardCount, "Testr Dashboard Pixel", 'height=104, attributes={"window":"dashboard"}');
	},
	createDashboardNotificationGridunit: function() {
		++this.dashboardCount;
		this.log("dashboard.html", this.dashboardCount);
		window.open("dashboard.html?count="+this.dashboardCount, "Testr Dashboard Gridunit", 'height=11, attributes={"window":"dashboard","metrics":"units"}');
	},
	createDashboardNotificationClickableWhenLocked: function() {
		++this.dashboardCount;
		this.log("dashboard.html", this.dashboardCount);
		window.open("dashboard.html?count="+this.dashboardCount, "Testr Dashboard clickableWhenLocked", 'attributes={"window":"dashboard","clickableWhenLocked":true}');
	}
});
