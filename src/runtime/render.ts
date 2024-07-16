type RenderData = { type: any; props: any; children: any };

function h(type, props, ...children) {
	return { type, props: props || {}, children };
}

const Fragment = Symbol.for("ski.fragment");

export { h, Fragment, type RenderData };
