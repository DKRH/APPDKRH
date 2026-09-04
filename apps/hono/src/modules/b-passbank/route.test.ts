import {
	beforeEach,
	describe,
	expect,
	mock,
	test,
} from "bun:test";

const getAll = mock();
const getById = mock();
const createData = mock();
const editData = mock();
const deleteData = mock();
const restoreData = mock();
const deleteDataForever = mock();

mock.module("./service", () => ({
	getAll,
	getById,
	createData,
	editData,
	deleteData,
	restoreData,
	deleteDataForever,
}));

const app = (await import("./route")).default;

describe("passbank routes", () => {
	beforeEach(() => {
		getAll.mockReset();
		getById.mockReset();
		createData.mockReset();
		editData.mockReset();
		deleteData.mockReset();
		restoreData.mockReset();
		deleteDataForever.mockReset();
	});

	describe("GET /", () => {
		test("calls getAll", async () => {
			getAll.mockResolvedValue(
				new Response(
					JSON.stringify({
						data: [],
					}),
					{
						status: 200,
						headers: {
							"Content-Type":
								"application/json",
						},
					},
				),
			);

			const response = await app.request("/");

			expect(response.status).toBe(200);
			expect(getAll).toHaveBeenCalledTimes(1);
		});

		test("supports query parameters", async () => {
			getAll.mockResolvedValue(
				new Response(
					JSON.stringify([]),
					{
						status: 200,
					},
				),
			);

			await app.request(
				"/?search=github&offset=10&limit=20",
			);

			expect(getAll).toHaveBeenCalledTimes(1);
		});
	});

	describe("GET /:id", () => {
		test("calls getById", async () => {
			getById.mockResolvedValue(
				new Response(
					JSON.stringify({
						id: "passbank-1",
					}),
					{
						status: 200,
						headers: {
							"Content-Type":
								"application/json",
						},
					},
				),
			);

			const response = await app.request(
				"/passbank-1",
			);

			expect(response.status).toBe(200);
			expect(getById).toHaveBeenCalledTimes(1);
		});
	});

	describe("POST /", () => {
		test("calls createData", async () => {
			createData.mockResolvedValue(
				new Response(
					JSON.stringify({
						id: "passbank-1",
					}),
					{
						status: 201,
						headers: {
							"Content-Type":
								"application/json",
						},
					},
				),
			);

			const response = await app.request("/", {
				method: "POST",
				headers: {
					"Content-Type":
						"application/json",
				},
				body: JSON.stringify({
					title: "GitHub",
					username: "john",
				}),
			});

			expect(response.status).toBe(201);
			expect(createData).toHaveBeenCalledTimes(1);
		});
	});

	describe("PUT /:id", () => {
		test("calls editData", async () => {
			editData.mockResolvedValue(
				new Response(
					JSON.stringify({
						id: "passbank-1",
					}),
					{
						status: 200,
						headers: {
							"Content-Type":
								"application/json",
						},
					},
				),
			);

			const response = await app.request(
				"/passbank-1",
				{
					method: "PUT",
					headers: {
						"Content-Type":
							"application/json",
					},
					body: JSON.stringify({
						title: "Updated",
					}),
				},
			);

			expect(response.status).toBe(200);
			expect(editData).toHaveBeenCalledTimes(1);
		});
	});

	describe("DELETE /:id", () => {
		test("calls deleteData", async () => {
			deleteData.mockResolvedValue(
				new Response(
					JSON.stringify({
						id: "passbank-1",
					}),
					{
						status: 200,
						headers: {
							"Content-Type":
								"application/json",
						},
					},
				),
			);

			const response = await app.request(
				"/passbank-1",
				{
					method: "DELETE",
				},
			);

			expect(response.status).toBe(200);
			expect(deleteData).toHaveBeenCalledTimes(1);
		});
	});

	describe("PUT /:id/restore", () => {
		test("calls restoreData", async () => {
			restoreData.mockResolvedValue(
				new Response(
					JSON.stringify({
						id: "passbank-1",
					}),
					{
						status: 200,
						headers: {
							"Content-Type":
								"application/json",
						},
					},
				),
			);

			const response = await app.request(
				"/passbank-1/restore",
				{
					method: "PUT",
				},
			);

			expect(response.status).toBe(200);
			expect(restoreData).toHaveBeenCalledTimes(1);
		});
	});

	describe("DELETE /:id/forever", () => {
		test("calls deleteDataForever", async () => {
			deleteDataForever.mockResolvedValue(
				new Response(
					JSON.stringify({
						id: "passbank-1",
					}),
					{
						status: 200,
						headers: {
							"Content-Type":
								"application/json",
						},
					},
				),
			);

			const response = await app.request(
				"/passbank-1/forever",
				{
					method: "DELETE",
				},
			);

			expect(response.status).toBe(200);
			expect(
				deleteDataForever,
			).toHaveBeenCalledTimes(1);
		});
	});
});