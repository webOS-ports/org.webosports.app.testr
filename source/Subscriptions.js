/* Subscriptions.js - panel for manual tests of PalmBus subscriptions for LuneOS */

enyo.kind({
	name: "Subscriptions",
	layoutKind: "FittableRowsLayout",
	components: [
	    { kind: "onyx.Toolbar", components: [
	         {content: $L("PalmBus Subscriptions")}
	    ]},
	    {
	    	kind: "Control",
	    	fit: true
	    }
	]
});
