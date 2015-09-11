enyo.kind({
	name: "ListItem",
	classes: "list-item",
	layoutKind: "FittableColumnsLayout",
	handlers: {
		onmousedown: "pressed",
		ondragstart: "released",
		onmouseup: "released"
	},
	published: {
		icon: "",
		title: ""
	},
	components:[
		{name: "ItemIcon", kind: "Image", style: "height: 100%"},
		{name: "ItemTitle", style: "padding-left: 10px;"}
	],
	create: function() {
		this.inherited(arguments);
		this.$.ItemIcon.setSrc(this.icon);
		this.$.ItemTitle.setContent(this.title);
	},
	pressed: function() {
		this.addClass("onyx-selected");
	},
	released: function() {
		this.removeClass("onyx-selected");
	}
});

enyo.kind({
	name: "EmptyPanel",
	layoutKind: "FittableRowsLayout",
	style: "background-color: #555;",
	components:[
		{kind: "onyx.Toolbar"},
		{fit: true}
	]
});

enyo.kind({
	name: "AppPanels",
	kind: "Panels",
	realtimeFit: true,
	arrangerKind: "CollapsingArranger",
	classes: "app-panels",
	components:[
		{name: "MenuPanel",
		style: "width: 33%",
		layoutKind: "FittableRowsLayout",
		components:[
			{kind: "PortsHeader",
			title: "Testr",
			taglines: [
				"Testing time!!"
			]},
			{kind: "Scroller",
			horizontal: "hidden",
			classes: "enyo-fill",
			style: "background-image:url('assets/bg.png')",
			fit: true,
			touch: true,
			components:[
				{kind: "onyx.Toolbar", classes: "list-header", content: "Test groups"},
				{kind: "ListItem", icon: "icon.png", title: "HTML5 Audio", ontap: "openHtml5Audio"},
				{kind: "ListItem", icon: "icon.png", title: "Telephony", ontap: "openTelephony"},
				{kind: "ListItem", icon: "icon.png", title: "Windowing", ontap: "openWindowing"},
				{kind: "ListItem", icon: "icon.png", title: "PalmBus Subscriptions", ontap: "openSubscriptions"},
				{kind: "ListItem", icon: "icon.png", title: "Notifications", ontap: "openNotifications"},
				{kind: "ListItem", icon: "icon.png", title: "Geolocation", ontap: "openGeolocation"},
				{kind: "ListItem", icon: "icon.png", title: "Responsive Images", ontap: "openResponsiveImg"}
			]}
		]},
		{name: "ContentPanels",
		kind: "Panels",
		arrangerKind: "CardArranger",
		draggable: false,
		index: 1,
		components:[
			{kind: "EmptyPanel"},
			{kind: "Html5Audio"},
			{kind: "Telephony"},
			{kind: "Windowing"},
			{kind: "Subscriptions"},
			{kind: "Notifications"},
			{kind: "Geolocation"},
			{kind: "ResponsiveImg"}
		]}
	],
	openPanel: function(index) {
		this.$.ContentPanels.setIndex(index);

		if (enyo.Panels.isScreenNarrow())
			this.setIndex(index);
	},
	openHtml5Audio: function(inSender) {
		this.openPanel(1);
	},
	openTelephony: function(inSender) {
		this.openPanel(2);
	},
	openWindowing: function (inSender) {
		this.openPanel(3);
	},
	openSubscriptions: function (inSender, inEvent) {
		this.openPanel(4);
	},
	openNotifications: function(inSender) {
		this.openPanel(5);
	},
	openGeolocation: function (inSender, inEvent) {
		this.openPanel(6);
	},
	openResponsiveImg: function (inSender, inEvent) {
		this.openPanel(7);
	}
});

enyo.kind({
	name: "App",
	layoutKind: "FittableRowsLayout",
	components: [
		{kind: "Signals",
		ondeviceready: "deviceready",
		onbackbutton: "handleBackGesture",
		onCoreNaviDragStart: "handleCoreNaviDragStart",
		onCoreNaviDrag: "handleCoreNaviDrag",
		onCoreNaviDragFinish: "handleCoreNaviDragFinish"},
		{name: "AppPanels", kind: "AppPanels", fit: true},
		{kind: "CoreNavi", fingerTracking: true}
	],
	//Handlers
	reflow: function(inSender) {
		this.inherited(arguments);
		if(enyo.Panels.isScreenNarrow()) {
			this.$.AppPanels.setArrangerKind("CollapsingArranger");
			this.$.AppPanels.setDraggable(false);
			this.$.AppPanels.$.ContentPanels.addStyles("box-shadow: 0");
		}
		else {
			this.$.AppPanels.setArrangerKind("CollapsingArranger");
			this.$.AppPanels.setDraggable(true);
			this.$.AppPanels.$.ContentPanels.addStyles("box-shadow: -4px 0px 4px rgba(0,0,0,0.3)");
		}
	},
	handleBackGesture: function(inSender, inEvent) {
		if (enyo.Panels.isScreenNarrow() && this.$.AppPanels.getIndex() > 0) {
			this.$.AppPanels.setIndex(0);
			inEvent.preventDefault();   // prevent minimizing card
		}
	},
	handleCoreNaviDragStart: function(inSender, inEvent) {
		this.$.AppPanels.dragstartTransition(!this.$.AppPanels.draggable ? this.reverseDrag(inEvent) : inEvent);
	},
	handleCoreNaviDrag: function(inSender, inEvent) {
		this.$.AppPanels.dragTransition(!this.$.AppPanels.draggable ? this.reverseDrag(inEvent) : inEvent);
	},
	handleCoreNaviDragFinish: function(inSender, inEvent) {
		this.$.AppPanels.dragfinishTransition(!this.$.AppPanels.draggable ? this.reverseDrag(inEvent) : inEvent);
	},
	//Utility Functions
	reverseDrag: function(inEvent) {
		inEvent.dx = -inEvent.dx;
		inEvent.ddx = -inEvent.ddx;
		inEvent.xDirection = -inEvent.xDirection;
		return inEvent;
	}
});
