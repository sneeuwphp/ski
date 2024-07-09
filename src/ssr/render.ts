import { Fragment } from "../runtime/render";

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

/**
 * Renders an element to a string.
 *
 * TODO: refactor to make my own.
 */
const renderToString = (element: unknown) => {
  if (
    typeof element === "string" ||
    typeof element === "number" ||
    typeof element === "bigint"
  ) {
    return String(element);
  }

  if (typeof element === "boolean") {
    return "";
  }

  if (typeof element === "object" && element !== null) {
    const { type, props, children } = element;

    if (type === Fragment || Array.isArray(element)) {
      return (children || [])
        .map((child: any) => renderToString(child))
        .join("");
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

    const childrenString = (children || [])
      .map((child: any) => renderToString(child))
      .join("");

    if (SELF_CLOSING_TAGS.has(type)) {
      return `<${type}${propsString} />`;
    }

    return `<${type}${propsString}>${childrenString}</${type}>`;
  }
};

export { renderToString };
