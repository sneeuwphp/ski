const Fragment = Symbol.for("ski.fragment");

const jsxDEV = (type, props, key) => {
	return { type, props: props || {}, key };
	// jsxDEV(type, props, key, isStaticChildren, source, self)
};

export { Fragment, jsxDEV };
