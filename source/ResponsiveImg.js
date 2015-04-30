enyo.kind({
	name: "ResponsiveImg",
	layoutKind: "FittableRowsLayout",
	palm: false,
	components:[
		{kind: "Signals", ondeviceready: "deviceready"},
		{
			kind: "onyx.Toolbar",
			style: "line-height: 36px;",
			components:[
				{ content: "Responsive Images" },
			]
		},
		{
			kind: "Scroller",
			touch: true,
			horizontal: "hidden",
			fit: true,
			components: [
				{tag: "div", style: "padding: 35px 10% 35px 10%;", components: [
					{content: "Which images are shown below depends on support for the srcset attribute of img tags." +
							" If the green 640x480 image (scaled to 320x240) is shown, this device will benefit from double-density graphics." +
							" If the pink 320x240 image is shown, srcset is supported, but the screen is standard DPI.",
							style: 'color: white; margin: 1rem 0;'},
					{content: "x descriptor", style: 'color: white; margin: 1rem 0;'},
					{tag: 'img', attributes: {srcset: "assets/responsive-srcset-320.png 1x, assets/responsive-srcset-640.png 2x",
							src: "assets/responsive-src-320.png"}},
					{content: "w descriptor", style: 'color: white; margin: 1rem 0;'},
					{tag: 'img', attributes: {srcset: "assets/responsive-srcset-320.png 320w, assets/responsive-srcset-640.png 640w",
							sizes:"320px", src: "assets/responsive-src-320.png"}}
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
});
