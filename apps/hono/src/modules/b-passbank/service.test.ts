import {
	beforeEach,
	describe,
	expect,
	mock,
	test,
} from "bun:test";

const getAll = mock();
const create = mock();
const update = mock();
const remove = mock();
const restore = mock();
const deleteForever = mock();
const findById = mock();

mock.module("./repo", () => ({
	getAll,
	create,
	update,
	remove,
	restore,
	deleteForever,
	findById,
}));

const service = await import("./service");

function createContext(
	options: {
		query?: Record<string, string>;
		param?: Record<string, string>;
		body?: unknown;
		userId?: string;
	} = {},
) {
	const {
		query = {},
		param = {},
		body,
		userId = "user-1",
	} = options;

	return {
		req: {
			query: (name: string) => query[name],
			param: (name: string) => param[name],
			json: async () => body,
		},
		get: (name: string) => {
			if (name === "userId") {
				return userId;
			}

			return undefined;
		},
		json: (data: unknown, status?: number) => {
			return {
				data,
				status: status ?? 200,
			};
		},
	} as any;
}

describe("passbank service", () => {
	beforeEach(() => {
		getAll.mockReset();
		create.mockReset();
		update.mockReset();
		remove.mockReset();
		restore.mockReset();
		deleteForever.mockReset();
		findById.mockReset();
	});

	describe("getAll", () => {
		test("uses default query values", async () => {
			const result = {
				data: [],
				total: 0,
			};

			getAll.mockResolvedValue(result);

			const c = createContext();

			const response = await service.getAll(c);

			expect(getAll).toHaveBeenCalledWith(
				"",
				0,
				50,
			);

			expect(response).toEqual({
				data: result,
				status: 200,
			});
		});

		test("passes search, offset and limit", async () => {
			getAll.mockResolvedValue([]);

			const c = createContext({
				query: {
					search: "github",
					offset: "20",
					limit: "10",
				},
			});

			await service.getAll(c);

			expect(getAll).toHaveBeenCalledWith(
				"github",
				20,
				10,
			);
		});

		test("converts offset and limit to numbers", async () => {
			getAll.mockResolvedValue([]);

			const c = createContext({
				query: {
					search: "test",
					offset: "100",
					limit: "25",
				},
			});

			await service.getAll(c);

			const args = getAll.mock.calls[0];

			expect(args[1]).toBe(100);
			expect(args[2]).toBe(25);
		});
	});

	describe("createData", () => {
		test("creates passbank and returns 201", async () => {
			const body = {
				title: "GitHub",
				username: "john",
				note: "test",
			};

			const result = {
				id: "passbank-1",
				...body,
			};

			create.mockResolvedValue(result);

			const c = createContext({
				body,
				userId: "user-123",
			});

			const response = await service.createData(c);

			expect(create).toHaveBeenCalledWith(
				body,
				"user-123",
			);

			expect(response).toEqual({
				data: result,
				status: 201,
			});
		});
	});

	describe("editData", () => {
		test("returns 400 when id is missing", async () => {
			const c = createContext({
				param: {},
				body: {
					title: "Updated",
				},
			});

			const response = await service.editData(c);

			expect(response).toEqual({
				data: {
					message: "ID is required",
				},
				status: 400,
			});

			expect(update).not.toHaveBeenCalled();
		});

		test("updates passbank", async () => {
			const body = {
				title: "Updated",
			};

			const result = {
				id: "passbank-1",
				title: "Updated",
			};

			update.mockResolvedValue(result);

			const c = createContext({
				param: {
					id: "passbank-1",
				},
				body,
				userId: "user-123",
			});

			const response = await service.editData(c);

			expect(update).toHaveBeenCalledWith(
				"passbank-1",
				body,
				"user-123",
			);

			expect(response).toEqual({
				data: result,
				status: 200,
			});
		});

		test("returns 404 when passbank does not exist", async () => {
			update.mockResolvedValue(undefined);

			const c = createContext({
				param: {
					id: "passbank-1",
				},
				body: {
					title: "Updated",
				},
			});

			const response = await service.editData(c);

			expect(response).toEqual({
				data: {
					message: "Passbank not found",
				},
				status: 404,
			});
		});
	});

	describe("deleteData", () => {
		test("returns 400 when id is missing", async () => {
			const c = createContext();

			const response = await service.deleteData(c);

			expect(response).toEqual({
				data: {
					message: "ID is required",
				},
				status: 400,
			});

			expect(remove).not.toHaveBeenCalled();
		});

		test("deletes passbank", async () => {
			const result = {
				id: "passbank-1",
			};

			remove.mockResolvedValue(result);

			const c = createContext({
				param: {
					id: "passbank-1",
				},
				userId: "user-123",
			});

			const response = await service.deleteData(c);

			expect(remove).toHaveBeenCalledWith(
				"passbank-1",
				"user-123",
			);

			expect(response).toEqual({
				data: result,
				status: 200,
			});
		});

		test("returns 404 when passbank does not exist", async () => {
			remove.mockResolvedValue(undefined);

			const c = createContext({
				param: {
					id: "passbank-1",
				},
			});

			const response = await service.deleteData(c);

			expect(response).toEqual({
				data: {
					message: "Passbank not found",
				},
				status: 404,
			});
		});
	});

	describe("restoreData", () => {
		test("returns 400 when id is missing", async () => {
			const c = createContext();

			const response = await service.restoreData(c);

			expect(response).toEqual({
				data: {
					message: "ID is required",
				},
				status: 400,
			});

			expect(restore).not.toHaveBeenCalled();
		});

		test("restores passbank", async () => {
			const result = {
				id: "passbank-1",
			};

			restore.mockResolvedValue(result);

			const c = createContext({
				param: {
					id: "passbank-1",
				},
				userId: "user-123",
			});

			const response = await service.restoreData(c);

			expect(restore).toHaveBeenCalledWith(
				"passbank-1",
				"user-123",
			);

			expect(response).toEqual({
				data: result,
				status: 200,
			});
		});

		test("returns 404 when passbank does not exist", async () => {
			restore.mockResolvedValue(undefined);

			const c = createContext({
				param: {
					id: "passbank-1",
				},
			});

			const response = await service.restoreData(c);

			expect(response).toEqual({
				data: {
					message: "Passbank not found",
				},
				status: 404,
			});
		});
	});

	describe("deleteDataForever", () => {
		test("returns 400 when id is missing", async () => {
			const c = createContext();

			const response =
				await service.deleteDataForever(c);

			expect(response).toEqual({
				data: {
					message: "ID is required",
				},
				status: 400,
			});

			expect(deleteForever).not.toHaveBeenCalled();
		});

		test("permanently deletes passbank", async () => {
			const result = {
				id: "passbank-1",
			};

			deleteForever.mockResolvedValue(result);

			const c = createContext({
				param: {
					id: "passbank-1",
				},
			});

			const response =
				await service.deleteDataForever(c);

			expect(deleteForever).toHaveBeenCalledWith(
				"passbank-1",
			);

			expect(response).toEqual({
				data: result,
				status: 200,
			});
		});
	});

	describe("getById", () => {
		test("returns 400 when id is missing", async () => {
			const c = createContext();

			const response = await service.getById(c);

			expect(response).toEqual({
				data: {
					message: "ID is required",
				},
				status: 400,
			});

			expect(findById).not.toHaveBeenCalled();
		});

		test("returns passbank", async () => {
			const result = {
				id: "passbank-1",
				title: "GitHub",
			};

			findById.mockResolvedValue(result);

			const c = createContext({
				param: {
					id: "passbank-1",
				},
			});

			const response = await service.getById(c);

			expect(findById).toHaveBeenCalledWith(
				"passbank-1",
			);

			expect(response).toEqual({
				data: result,
				status: 200,
			});
		});

		test("returns 404 when passbank does not exist", async () => {
			findById.mockResolvedValue(undefined);

			const c = createContext({
				param: {
					id: "does-not-exist",
				},
			});

			const response = await service.getById(c);

			expect(response).toEqual({
				data: {
					message: "Passbank not found",
				},
				status: 404,
			});
		});
	});
});