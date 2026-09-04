import { beforeEach, describe, expect, mock, test } from "bun:test";

const auditedList = mock();
const auditedInsert = mock();
const auditedUpdate = mock();
const auditedDelete = mock();
const auditedRestore = mock();
const auditedDeleteForever = mock();
const auditedFindById = mock();

mock.module("@/db/audit", () => ({
	auditedList,
	auditedInsert,
	auditedUpdate,
	auditedDelete,
	auditedRestore,
	auditedDeleteForever,
	auditedFindById,
}));

const repo = await import("./repo");

describe("passbank repo", () => {
	beforeEach(() => {
		auditedList.mockReset();
		auditedInsert.mockReset();
		auditedUpdate.mockReset();
		auditedDelete.mockReset();
		auditedRestore.mockReset();
		auditedDeleteForever.mockReset();
		auditedFindById.mockReset();
	});

	describe("getAll", () => {
		test("calls auditedList with search, offset and limit", async () => {
			const result = [
				{
					id: "1",
					title: "Test",
				},
			];

			auditedList.mockResolvedValue(result);

			const response = await repo.getAll(
				"test",
				10,
				20,
			);

			expect(response).toEqual(result);
			expect(auditedList).toHaveBeenCalledTimes(1);

			const [options] = auditedList.mock.calls[0];

			expect(options.search).toBe("test");
			expect(options.offset).toBe(10);
			expect(options.limit).toBe(20);
			expect(options.searchableColumns).toHaveLength(3);
		});
	});

	describe("create", () => {
		test("calls auditedInsert", async () => {
			const data = {
				title: "My Password",
				username: "john",
				note: "test",
			};

			const result = {
				id: "123",
				...data,
			};

			auditedInsert.mockResolvedValue(result);

			const response = await repo.create(
				data,
				"user-1",
			);

			expect(response).toEqual(result);

			expect(auditedInsert).toHaveBeenCalledTimes(1);
			expect(auditedInsert.mock.calls[0][1]).toEqual(data);
			expect(auditedInsert.mock.calls[0][2]).toBe("user-1");
		});
	});

	describe("update", () => {
		test("calls auditedUpdate with id, data and userId", async () => {
			const data = {
				title: "Updated",
			};

			const result = {
				id: "passbank-1",
				title: "Updated",
			};

			auditedUpdate.mockResolvedValue(result);

			const response = await repo.update(
				"passbank-1",
				data,
				"user-1",
			);

			expect(response).toEqual(result);

			expect(auditedUpdate).toHaveBeenCalledTimes(1);

			const args = auditedUpdate.mock.calls[0];

			expect(args[3]).toBe("passbank-1");
			expect(args[4]).toEqual(data);
			expect(args[5]).toBe("user-1");
		});
	});

	describe("remove", () => {
		test("calls auditedDelete", async () => {
			const result = {
				id: "passbank-1",
			};

			auditedDelete.mockResolvedValue(result);

			const response = await repo.remove(
				"passbank-1",
				"user-1",
			);

			expect(response).toEqual(result);

			expect(auditedDelete).toHaveBeenCalledTimes(1);

			const args = auditedDelete.mock.calls[0];

			expect(args[3]).toBe("passbank-1");
			expect(args[4]).toBe("user-1");
		});
	});

	describe("restore", () => {
		test("calls auditedRestore", async () => {
			const result = {
				id: "passbank-1",
			};

			auditedRestore.mockResolvedValue(result);

			const response = await repo.restore(
				"passbank-1",
				"user-1",
			);

			expect(response).toEqual(result);

			expect(auditedRestore).toHaveBeenCalledTimes(1);

			const args = auditedRestore.mock.calls[0];

			expect(args[3]).toBe("passbank-1");
			expect(args[4]).toBe("user-1");
		});
	});

	describe("deleteForever", () => {
		test("calls auditedDeleteForever", async () => {
			const result = {
				id: "passbank-1",
			};

			auditedDeleteForever.mockResolvedValue(result);

			const response = await repo.deleteForever(
				"passbank-1",
			);

			expect(response).toEqual(result);

			expect(auditedDeleteForever).toHaveBeenCalledTimes(1);

			const args = auditedDeleteForever.mock.calls[0];

			expect(args[3]).toBe("passbank-1");
		});
	});

	describe("findById", () => {
		test("calls auditedFindById", async () => {
			const result = {
				id: "passbank-1",
				title: "Test",
			};

			auditedFindById.mockResolvedValue(result);

			const response = await repo.findById(
				"passbank-1",
			);

			expect(response).toEqual(result);

			expect(auditedFindById).toHaveBeenCalledTimes(1);

			const args = auditedFindById.mock.calls[0];

			expect(args[2]).toBe("passbank-1");
		});

		test("returns undefined when record does not exist", async () => {
			auditedFindById.mockResolvedValue(undefined);

			const response = await repo.findById(
				"does-not-exist",
			);

			expect(response).toBeUndefined();
		});
	});
});