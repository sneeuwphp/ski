const getHandler = (hash: string, appUrl: string) => {
	return new Proxy(
		{},
		{
			get(target, prop, receiver) {
				return async (...args) => {
					const response = await fetch(`${appUrl}/_internal`, {
						method: "POST",
						body: JSON.stringify({ hash, action: prop, args }),
					});

					// TODO: if error, print error

					return response.text();
				};
			},
		},
	);
};

export default getHandler;
