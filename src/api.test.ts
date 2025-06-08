import { beforeEach, describe, expect, mock, test } from "bun:test";
import { getApiKey, makeApiRequest } from "./api.js";

// Mock fetch globally
global.fetch = mock(() => {});

describe("API utilities", () => {
	beforeEach(() => {
		mock.restore();
		// Clear environment variables
		process.env.CAPACITIES_API_KEY = undefined;
	});

	describe("getApiKey", () => {
		test("should return API key from environment variable", () => {
			process.env.CAPACITIES_API_KEY = "test-api-key";
			expect(getApiKey()).toBe("test-api-key");
		});

		test("should throw error when API key is not set", () => {
			expect(() => getApiKey()).toThrow(
				"CAPACITIES_API_KEY environment variable is required",
			);
		});
	});

	describe("makeApiRequest", () => {
		test("should make successful API request with proper headers", async () => {
			process.env.CAPACITIES_API_KEY = "test-api-key";

			const mockResponse = {
				ok: true,
				json: async () => ({ success: true }),
			};
			global.fetch = mock(() => Promise.resolve(mockResponse));

			const response = await makeApiRequest("/test-endpoint");

			expect(global.fetch).toHaveBeenCalledWith(
				"https://api.capacities.io/test-endpoint",
				{
					headers: {
						Authorization: "Bearer test-api-key",
						"Content-Type": "application/json",
					},
				},
			);
			expect(response).toBe(mockResponse);
		});

		test("should pass through additional options", async () => {
			process.env.CAPACITIES_API_KEY = "test-api-key";

			const mockResponse = { ok: true };
			global.fetch = mock(() => Promise.resolve(mockResponse));

			await makeApiRequest("/test", {
				method: "POST",
				body: JSON.stringify({ test: true }),
			});

			expect(global.fetch).toHaveBeenCalledWith(
				"https://api.capacities.io/test",
				{
					method: "POST",
					body: JSON.stringify({ test: true }),
					headers: {
						Authorization: "Bearer test-api-key",
						"Content-Type": "application/json",
					},
				},
			);
		});

		test("should throw error for non-ok responses", async () => {
			process.env.CAPACITIES_API_KEY = "test-api-key";

			const mockResponse = {
				ok: false,
				status: 400,
				statusText: "Bad Request",
				text: async () => "Invalid request",
			};
			global.fetch = mock(() => Promise.resolve(mockResponse));

			await expect(makeApiRequest("/test")).rejects.toThrow(
				"Capacities API error: 400 Bad Request - Invalid request",
			);
		});
	});
});
