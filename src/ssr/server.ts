import { createServer, IncomingMessage, ServerResponse } from "http";
import { renderToString } from "./render.js";

type Body = {
	path: string;
};

const isValidBody = (obj: unknown): obj is Body => {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"path" in obj &&
		typeof obj.path === "string"
	);
};

const readableToString: (readable: IncomingMessage) => Promise<string> = (
	readable,
) =>
	new Promise((resolve, reject) => {
		let data = "";
		readable.on("data", (chunk) => (data += chunk));
		readable.on("end", () => resolve(data));
		readable.on("error", (err) => reject(err));
	});

type Options = {
	resolve: (path: string) => unknown;
	port?: number;
};

export default (options: Options): void => {
	const port = options.port || 2002;

	const handler = async (
		request: IncomingMessage,
		response: ServerResponse,
	) => {
		try {
			const body = JSON.parse(await readableToString(request));
			if (!isValidBody(body)) {
				throw "SSR request body is not valid";
			}

			let page = null;
			try {
				page = await options.resolve(body.path);
			} catch (e) {
				throw `Could not find page '${body.path}.ski' in pages directory`;
			}

			// todo: if file has handler, call mount method
			// how to do this with nested components?

			try {
				const renderFn = page.default();
				const html = renderToString(renderFn);

				const layout = await options.layout();
				const total = layout.default.replace("<!-- inject-ski -->", html);

				response.write(total);
				response.end();
			} catch (e) {
				console.error(e);
				throw `An error occurred while rendering '${body.path}.ski'`;
			}
		} catch (e) {
			console.error(e);
		}
	};

	createServer(handler).listen(port, () => {
		console.log(`⛷️ Ski SSR server started and listening on port ${port}`);
	});
};
