import getHandler from "./handler.js";
import { Fragment } from "../runtime/render.js";

const APP_URL = "http://localhost:3000";
const SELF_CLOSING_TAGS = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
]);

const renderArrayToString = async (elements: unknown[]): Promise<string> => {
	return (await Promise.all(elements.map(renderToString))).join("");
};

/**
 * Renders an element and its children to a string.
 */
const renderToString = async (element: unknown): Promise<string> => {
	if (typeof element === "string") {
		return element;
	}

	if (typeof element === "boolean") {
		return "";
	}

	if (typeof element === "number" || typeof element === "bigint") {
		return String(element);
	}

	if (typeof element === "object" && element !== null) {
		if (Array.isArray(element)) {
			return await renderArrayToString(await element);
		}

		// TODO: add types (and reject object that don't have this exact signature)
		let { type, props, key } = await element;

		if (type === Fragment) {
			return await renderArrayToString(props.children);
		}

		let handler = null;
		if (typeof type === "function") {
			handler = getHandler(props.__source, APP_URL);
			const result = await type(props, handler);

			return await renderToString(result);
		}

		const propsString = Object.entries(props || [])
			.map(([key, value]) => {
				if (typeof value === "boolean") {
					return value ? ` ${key}` : "";
				}

				if (key.startsWith("on")) {
					return "";
				}

				return ` ${key}="${value}"`;
			})
			.join("");

		const childrenString = await renderToString(props.children);

		if (SELF_CLOSING_TAGS.has(type)) {
			return `<${type}${propsString} />`;
		}

		return `<${type}${propsString}>${childrenString}</${type}>`;
	}

	return "";
};

export { renderToString };
