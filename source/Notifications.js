enyo.kind({
	name: "Notifications",
	layoutKind: "FittableRowsLayout",
	palm: false,
	currentNotificationId: 0,
	bannerCount: 0,
	dashboardCount: 0,
	systemPopupCount: 0,
	html5Count: 0,
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
							{content: "Should raise/close a transient banner notification, with alert sound & vibration." +
								" Dashboards should be closed, if open." +
								" Tapping the banner should re-launch this app or maximize the card, if necessary." +
								" Banner should be displayed for five seconds, unless another banner is queued.",
								style: "padding: 5px; color: white"},
							{kind: "onyx.Button", style: "width: 100%", content: "Add with custom icon", ontap: "createBannerCustomIcon"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Add with custom sound", ontap: "createBannerCustomSound"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Add with no sound", ontap: "createBannerNoSound"},
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
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Add 180px (DIPs) height dash", ontap: "createDashboardNotificationPixel"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Add 32 gridunit height dash", ontap: "createDashboardNotificationGridunit"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Add clickableWhenLocked default height dash", ontap: "createDashboardNotificationClickableWhenLocked"}
						]}
					]},

					{kind: "onyx.Groupbox", components: [
						{kind: "onyx.GroupboxHeader", content: "System Popups"},
						{components: [
							{content: "Should open a window independent of cards." +
								" Pressing the Home button (on Touchpads) should dismiss it." +
								" Going to card mode should not dismiss it." +
								" If another system popup is displayed, should be displayed after the first one closes.",
								style: "padding: 5px; color: white"},
							{kind: "onyx.Button", style: "width: 100%", content: "Create system popup 160px (DIPs) tall", ontap: "createSystemPopupPixel"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Create system popup 16 gridunits tall", ontap: "createSystemPopupGridunit"},
						]}
					]},

					{kind: "onyx.Groupbox", components: [
						{kind: "onyx.GroupboxHeader", content: "HTML5 Non-persistent Notifications"},
						{components: [
							{content: " Should display title text, body text (if provided) & icon (if provided)." +
									" Should disappear after a few seconds." +
									" New notifications should immediately replace old ones from this app." +
									" Tapping notification should maximize card & call click handler." +
									" [Behaves like a Banner notification, with an optional second string.]",
								style: "padding: 5px; color: white"},
							{kind: "onyx.Button", style: "width: 100%", content: "Title, Body, Icon & default sound", ontap: "createHTML5NotificationAll"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Title, Icon & default sound", ontap: "createHTML5NotificationTitleIcon"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Title & default sound only", ontap: "createHTML5NotificationTitleOnly"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Title only & silent", ontap: "createHTML5NotificationTitleOnlySilent"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: "Title only & custom sound", ontap: "createHTML5NotificationTitleOnlyCustomSound"},
							{name: 'html5Out', content: " ", style: "padding: 5px; color: white"}
						]}
					]},

					{kind: "onyx.Groupbox", components: [
						{kind: "onyx.GroupboxHeader", content: "Vibration API"},
						{components: [
							{content: "Should perceptibly vibrate the device", style: "padding: 5px; color: white"},
							{kind: "onyx.Button", style: "width: 100%",                    content:  '"500" 0.2 sec', ontap: "vibrate500_2"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content: '"1000" 0.4 sec', ontap: "vibrate1000_4"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content:  '"300" 0.6 sec', ontap: "vibrate300_6"},
							{kind: "onyx.Button", style: "width: 100%; margin-top: 1rem;", content:  'Named effect: ringtone', ontap: "vibrateNamed"},
							{name: 'vibrateOut', content: " ", style: "padding: 5px; color: white"}
						]}
					]}
				]}
			]
		},
		{
			name: "vibrateService",
			kind: "LunaService",
			service: "palm://com.palm.vibrate/",
			method: "vibrate",
			subscribe: false,
			resubscribe: false,
			onResponse: "vibrateSuccess",
			onError: "vibrateFail"
		},
		{
			name: "vibrateNamedService",
			kind: "LunaService",
			service: "palm://com.palm.vibrate/",
			method: "vibrateNamedEffect",
			subscribe: false,
			resubscribe: false,
			onResponse: "vibrateSuccess",
			onError: "vibrateFail"
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
	createBannerCustomIcon: function() {
		if (!this.palm)
			return;

		var relaunchParamJson = JSON.stringify({foo: ++this.bannerCount});
		this.log(relaunchParamJson);
		this.currentNotificationId = PalmSystem.addBannerMessage("Banner with star icon " + this.bannerCount, relaunchParamJson, "assets/Contacts-favorites-star-blue.png", "alerts");
	},
	createBannerCustomSound: function() {
		if (!this.palm)
			return;

		var relaunchParamJson = JSON.stringify({foo: ++this.bannerCount});
		this.log(relaunchParamJson);
		this.currentNotificationId = PalmSystem.addBannerMessage("Banner with custom sound " + this.bannerCount, relaunchParamJson, undefined, "alerts", 'file:///usr/palm/sounds/alert.wav');
	},
	createBannerNoSound: function() {
		if (!this.palm)
			return;

		var relaunchParamJson = JSON.stringify({foo: ++this.bannerCount});
		this.log(relaunchParamJson);
		this.currentNotificationId = PalmSystem.addBannerMessage("Banner with no sound " + this.bannerCount, relaunchParamJson);
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
		window.open("dashboard.html?count="+this.dashboardCount, "Testr Dashboard Pixel", 'attributes={"window":"dashboard", "dashHeight":180}');
	},
	createDashboardNotificationGridunit: function() {
		++this.dashboardCount;
		this.log("dashboard.html", this.dashboardCount);
		window.open("dashboard.html?count="+this.dashboardCount, "Testr Dashboard Gridunit", 'attributes={"window":"dashboard","metrics":"units", "dashHeight":32}');
	},
	createDashboardNotificationClickableWhenLocked: function() {
		++this.dashboardCount;
		this.log("dashboard.html", this.dashboardCount);
		window.open("dashboard.html?count="+this.dashboardCount, "Testr Dashboard clickableWhenLocked", 'attributes={"window":"dashboard","clickableWhenLocked":true}');
	},

	createSystemPopupPixel: function() {
		++this.systemPopupCount;
		this.log();
		window.open("systemPopup.html?count="+this.systemPopupCount, "Testr System Popup Pixel", 'height=160, attributes={"window":"popupalert"}');
	},
	createSystemPopupGridunit: function() {
		++this.systemPopupCount;
		this.log();
		window.open("systemPopup.html?count="+this.systemPopupCount, "Testr System Popup Gridunit", 'height=16, attributes={"window":"popupalert","metrics":"units"}');
	},

	createHTML5NotificationAll: function() {
		++this.html5Count;
		this.createHTML5NotificationGeneric("All Three Title " + this.html5Count, {
			body: "Icon should be headphones",
			icon: 'assets/headphones.png',
			data: {html5Count: this.html5Count}
		});
	},
	createHTML5NotificationTitleIcon: function() {
		++this.html5Count;
		this.createHTML5NotificationGeneric("Icon should be star " + this.html5Count, {
			icon: 'assets/Contacts-favorites-star-blue.png',
			data: {html5Count: this.html5Count}
		});
	},
	createHTML5NotificationTitleOnly: function() {
		++this.html5Count;
		this.createHTML5NotificationGeneric("No body nor icon " + this.html5Count, {
			data: {html5Count: this.html5Count}
		});
	},
	createHTML5NotificationTitleOnlySilent: function () {
		++this.html5Count;
		this.createHTML5NotificationGeneric("Silent " + this.html5Count, {
			silent: true,
			data: {html5Count: this.html5Count}
		});
	},
	createHTML5NotificationTitleOnlyCustomSound: function () {
		++this.html5Count;
		this.createHTML5NotificationGeneric("Custom sound " + this.html5Count, {
			sound: 'assets/tones_3beeps_otasp_done-ondemand.mp3',
			data: {html5Count: this.html5Count}
		});
	},
	createHTML5NotificationGeneric: function(title, options) {
		var panel = this;

		if (! ('Notification' in window)) {
			this.$.html5Out.set('content', "HTML5 Notification API not present");
		} else if (Notification.permission === 'default') {
			console.log("requesting Notification permission");
			panel.$.html5Out.set('content', "requesting Notification permission");
			Notification.requestPermission(notifyIfPermitted);
		} else {   // Perm previously set, perhaps via manifest
			notifyIfPermitted();
		}

		function notifyIfPermitted() {
			console.log("Notification.permission:", Notification.permission);
			panel.$.html5Out.set('content', "Notification.permission: " + Notification.permission);

			if (Notification.permission === 'granted') {
				options = options || {};
				options.tag = 'Testr';
				console.log("options:", options);
				var notification = new Notification(title, options);
				notification.addEventListener('click', notificationClicked);
			}
		}

		function notificationClicked(evt) {
			console.log("notification clicked:", evt);
			panel.$.html5Out.set('content', "clicked: " + JSON.stringify(evt.target.data));
		}
	},

	vibrate500_2: function () {
		this.$.vibrateService.send({
			period: 500,   // ms [allegedly]
			duration: 200   // ms
		});
	},
	vibrate1000_4: function () {
		this.$.vibrateService.send({
			period: 1000,   // ms [allegedly]
			duration: 400   // ms
		});
	},
	vibrate300_6: function () {
		this.$.vibrateService.send({
			period: 300,   // ms [allegedly]
			duration: 600   // ms
		});
	},
	vibrateNamed: function () {
		this.$.vibrateNamedService.send({
			name: 'ringtone',
			continous: false
		});
	},
	vibrateSuccess: function (inSender, inRequest) {
		this.log();
		this.$.vibrateOut.set('content', " ");
	},
	vibrateFail: function (inSender, inErr) {
		this.error(inErr.errorText);
		this.$.vibrateOut.set('content', inErr.errorText || inErr.toString());
	}
});
