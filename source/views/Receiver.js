var Receiver = enyo.kind({
	name: "Reciver",
	kind: "Control",
	components: [
		{name: "out", content: "I'm an IFRAME. "},
		{kind: "Signals", onmessage: "displayMessage"}
	],
	
	displayMessage: function (inSender, inEvent) {
		this.log(inEvent.data);
		this.$.out.addContent(inEvent.data + " ");
	}
});
