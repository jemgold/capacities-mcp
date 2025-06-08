export const API_BASE_URL = "https://api.capacities.io";

export function getApiKey(): string {
	const apiKey = process.env.CAPACITIES_API_KEY;
	if (!apiKey) {
		throw new Error("CAPACITIES_API_KEY environment variable is required");
	}
	return apiKey;
}

export async function makeApiRequest(
	endpoint: string,
	options: RequestInit = {},
): Promise<Response> {
	const apiKey = getApiKey();

	const requestOptions = {
		...options,
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			...options.headers,
		},
	};

	const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Capacities API error: ${response.status} ${response.statusText} - ${errorText}`,
		);
	}

	return response;
}
