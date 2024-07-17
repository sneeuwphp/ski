const Fragment = Symbol.for("ski.fragment");

const jsx = (type, props, key) => {
	return { type, props: props || {}, key };
};

const jsxs = (type, props, key) => {
	return { type, props: props || {}, key };
};

export { Fragment, jsx, jsxs };
