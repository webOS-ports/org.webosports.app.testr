
enyo.kind({
	name: "WebComponents",
	layoutKind: "FittableRowsLayout",
	palm: false,
	components:[
		{
			kind: "onyx.Toolbar",
			style: "line-height: 36px;",
			components:[
				{ content: "Web Components" },
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
					    {kind: "onyx.GroupboxHeader", content: "Platform Support"},
						{style: 'color: white; padding: 1rem', components: [
							{content: "Templates: " + ('content' in document.createElement('template'))},
							{content: "HTML Imports: " + ('import' in document.createElement('link'))},
                            {content: "Custom Elements (v0): " + ('registerElement' in document)},
                            {content: "Custom Elements (v1): " + ('customElements' in window)},
                            {content: "Shadow DOM (v0): " + (document.head.createShadowRoot instanceof Function)},
                            {content: "Shadow DOM (v1): " + (document.head.attachShadow instanceof Function)}
						]},
					]},
				]}
			]
		},
	],


});
