import Component from "./component";

const createElement = (type, props, key) => {
	return { type, props: props || {}, key };
};

export { Component, createElement };
