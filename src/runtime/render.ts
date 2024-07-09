type RenderData = { type: any; props: any; children: any };

function h(type, props, ...children) {
	return { type, props: props || {}, children };
}

const Fragment = Symbol.for("sneeuw.fragment");

export { h, Fragment, type RenderData };
