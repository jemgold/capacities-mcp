import { describe, expect, it, beforeEach, vi } from "vitest";
import { getApiKey, makeApiRequest } from "./api.js";

// Mock fetch globally
global.fetch = vi.fn();

describe("API utilities", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	describe("getApiKey", () => {
		it("should return API key from environment variable", () => {
			vi.stubEnv("CAPACITIES_API_KEY", "test-api-key");
			expect(getApiKey()).toBe("test-api-key");
		});

		it("should throw error when API key is not set", () => {
			vi.stubEnv("CAPACITIES_API_KEY", "");
			expect(() => getApiKey()).toThrow(
				"CAPACITIES_API_KEY environment variable is required"
			);
		});
	});

	describe("makeApiRequest", () => {
		it("should make successful API request with proper headers", async () => {
			vi.stubEnv("CAPACITIES_API_KEY", "test-api-key");
			
			const mockResponse = {
				ok: true,
				json: async () => ({ success: true }),
			};
			(global.fetch as any).mockResolvedValueOnce(mockResponse);

			const response = await makeApiRequest("/test-endpoint");
			
			expect(global.fetch).toHaveBeenCalledWith(
				"https://api.capacities.io/test-endpoint",
				{
					headers: {
						Authorization: "Bearer test-api-key",
						"Content-Type": "application/json",
					},
				}
			);
			expect(response).toBe(mockResponse);
		});

		it("should pass through additional options", async () => {
			vi.stubEnv("CAPACITIES_API_KEY", "test-api-key");
			
			const mockResponse = { ok: true };
			(global.fetch as any).mockResolvedValueOnce(mockResponse);

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
				}
			);
		});

		it("should throw error for non-ok responses", async () => {
			vi.stubEnv("CAPACITIES_API_KEY", "test-api-key");
			
			const mockResponse = {
				ok: false,
				status: 400,
				statusText: "Bad Request",
				text: async () => "Invalid request",
			};
			(global.fetch as any).mockResolvedValueOnce(mockResponse);

			await expect(makeApiRequest("/test")).rejects.toThrow(
				"Capacities API error: 400 Bad Request - Invalid request"
			);
		});
	});
});