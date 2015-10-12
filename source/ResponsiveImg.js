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
				{tag: "div", style: "padding: 1rem;", components: [
					{style: 'color: white;', content: "window.devicePixelRatio: " + window.devicePixelRatio},

					{content: "Vector", style: 'margin-top: 1rem; font-size: larger; color: white;'},
					{content: "The higher the DPI of the screen, the sharper the SVG images should look relative to the PNG.",
							style: 'margin-bottom: 1rem; color: white;'},
					{tag: 'table', style: 'background: white; border-collapse: collapse;', components: [
						{tag: 'tr', components: [
							{tag: 'th', content: "SVG img"},
							{tag: 'th', content: "SVG background"},
							{tag: 'th', content: "Reference 1x&nbsp;PNG", allowHtml: true}
						]},
						{tag: 'tr', components: [
							{tag: 'td', components: [
								{tag: 'img', attributes: {src: "assets/headphones.svg"}}
							]},
							{tag: 'td', components: [
								{tag: 'div', style: "background-image: url(assets/headphones.svg); width: 32px; height: 32px; display: inline-block;"}
							]},
							{tag: 'td', components: [
								{tag: 'img', attributes: {src: "assets/headphones.png"}}
							]}
						]}
					]},

					{content: "Bitmap", style: 'margin-top: 1rem; font-size: larger; color: white;'},
					{content: "Which images are shown below depends on support for the <code>srcset</code> attribute of <code>img</code> tags." +
					" If the green image is shown, this device will benefit from double-density graphics." +
					" If the pink image is shown, <code>srcset</code> is supported, but the screen is standard DPI.",
							allowHtml: true, style: 'color: white;'},
					{classes: 'enyo-children-inline', components: [
						{style: 'margin-right: 0.7rem;', components: [
							{content: "w descriptor - fluid images need this", style: 'color: white; margin: 1rem 0;'},
							{tag: 'img', attributes: {srcset: "assets/responsive-1x.png 320w, assets/responsive-2x.png 640w",
								sizes:"320px", src: "assets/nonresponsive-1x.png"}}
						]},
						{components: [
							{content: "x descriptor - ok for fixed-size images", style: 'color: white; margin: 1rem 0;'},
							{tag: 'img', attributes: {srcset: "assets/responsive-1x.png 1x, assets/responsive-2x.png 2x",
								src: "assets/nonresponsive-1x.png"}}
						]}
					]},
					{content: "Which image is shown below depends on support for CSS <code>-webkit-image-set</code>." +
					" If the green image is shown, this device will benefit from double-density graphics." +
					" If the pink image is shown, CSS <code>-webkit-image-set</code> is supported, but the screen is standard DPI.",
							allowHtml: true, style: 'color: white; margin-top: 1rem;'},
					{classes: 'enyo-children-inline', components: [
						{components: [
							{content: "x descriptor - ok for fixed-size images", style: 'color: white; margin: 1rem 0;'},
							{classes: 'test-webkit-image-set'}
						]}
					]},

					{content: "Recommended syntax: w descriptor + hi-res fallback", style: 'margin-top: 1rem; font-size: larger; color: white;'},
					{style: 'color: white; margin-top: 1rem;', components: [
						{tag: 'code',
							content: "{tag: 'img', attributes: {srcset: 'assets/graphic-320x240.png 320w, assets/graphic-640x480.png 640w', \
							sizes:'320px', src: 'assets/graphic-640x480.png'}}"}
					]}
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
