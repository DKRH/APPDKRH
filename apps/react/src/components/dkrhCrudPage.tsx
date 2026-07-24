import { useEffect, useState } from "react";
import { DkrhCrudModal } from "@/components/dkrhCrudModal";
import { DkrhDeleteModal } from "@/components/dkrhDeleteModal";
import { apiFetch, getAPIURL } from "@/components/const";

export function DkrhCrudPage({

	title,

	apiBase,

	searchPlaceholder,

	columns,

	fields,

	deleteLabelColumn = "title"

}: any) {

	const LIMIT = 50;

	const [rows, setRows] = useState<any[]>([]);
	const [editing, setEditing] = useState<any>(null);
	const [deleteTarget, setDeleteTarget] = useState<any>(null);
	const [search, setSearch] = useState("");
	const [offset, setOffset] = useState(0);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [lookups, setLookups] = useState<Record<string, any[]>>({});

	useEffect(() => {
    		console.log("loadLookups useEffect");
		async function loadLookups() {
			const dropdowns = fields.filter(
				(f: any) => f.type === "dropdown" && f.api
			);

			const result: Record<string, any[]> = {};

			await Promise.all(
				dropdowns.map(async (f: any) => {
					const res = await apiFetch(getAPIURL(f.api));
					result[f.key] = await res.json();
				})
			);

        console.log("Lookups:", result);

			setLookups(result);
		}

		loadLookups();
	}, [fields]);

	async function loadData(
		searchValue: string,
		reset = false
	) {

		if (loading) return;

		setLoading(true);

		const currentOffset =
			reset ? 0 : offset;

		const res = await apiFetch(
			getAPIURL(
				`${apiBase}` +
				`?search=${encodeURIComponent(searchValue)}` +
				`&offset=${currentOffset}` +
				`&limit=${LIMIT}`
			)
		);

		const data =
			await res.json();

		if (reset) {
			setRows(data);
			setOffset(LIMIT);
			setHasMore(data.length === LIMIT);
		} else {
			setRows(prev => [
				...prev,
				...data
			]);
			setOffset(prev => prev + data.length);
			setHasMore(data.length === LIMIT);
		}

		setLoading(false);
	}

	async function confirmDelete() {

		if (!deleteTarget)
			return;

		await apiFetch(
			getAPIURL(
				`${apiBase}/${deleteTarget.id}`
			),
			{
				method: "DELETE",
			}
		);

		setDeleteTarget(null);

		setOffset(0);

		loadData(
			search,
			true
		);
	}

	useEffect(() => {

		loadData(
			"",
			true
		);

	}, []);

	useEffect(() => {

		function onScroll() {

			const nearBottom =

				window.innerHeight +

				window.scrollY

				>=

				document.body.offsetHeight
				- 300;

			if (nearBottom && !loading && hasMore) {
				loadData(search, false);
			}
		}

		window.addEventListener(
			"scroll",
			onScroll
		);

		return () =>
			window.removeEventListener(
				"scroll",
				onScroll
			);

	}, [search, loading, offset]);

	return (

		<div
			className="
				min-h-screen
				bg-zinc-950
				text-zinc-100
				p-6
			"
		>

			<div
				className="
					flex
					items-center
					justify-between
					mb-6
				"
			>

				<h1
					className="
						text-3xl
						font-bold
					"
				>
					{title}
				</h1>

				<button
					onClick={() =>
						setEditing({})
					}

					className="
						bg-blue-600
						hover:bg-blue-500
						px-4
						py-2
						rounded
					"
				>
					Add
				</button>

			</div>

			<div
				className="
					overflow-auto
					border
					border-zinc-800
					rounded-lg
				"
			>

				<div className="mb-4">

					<input
						type="text"

						placeholder={
							searchPlaceholder
						}

						value={search}

						onChange={(e) => {

							const value =
								e.target.value;

							setSearch(value);

							loadData(
								value,
								true
							);
						}}

						className="
							w-full
							bg-zinc-900
							border
							border-zinc-700
							rounded-lg
							px-4
							py-3
							text-zinc-100
						"
					/>

				</div>

				<table
					className="
						w-full
						text-sm
					"
				>

					<thead
						className="
							bg-zinc-900
						"
					>

						<tr>

							{columns.map(
								(c: any) => (

								<th
									key={c.key}

									className="
										p-3
										text-left
									"
								>
									{c.label}
								</th>
							))}

							<th
								className="
									p-3
									text-left
								"
							>
								Actions
							</th>

						</tr>

					</thead>

					<tbody>

						{rows.map((row) => (

							<tr
								key={row.id}

								className="
									border-t
									border-zinc-800
									hover:bg-zinc-900
								"
							>

								{columns.map(
									(c: any) => (

									<td
										key={c.key}

										className="
											p-3
											text-left
										"
									>

										{(() => {
											if (c.render)
												return c.render(row[c.key], row);

											if (c.show) {
												const field = fields.find(
													(f: any) => f.key === c.key
												);

												if (field) {
													const list = lookups[c.key] ?? [];
													
													const item = list.find(
														(x: any) =>
															x[field.valueField ?? "id"] === row[c.key]
													);

													console.log("item:", item);
													console.log("show:", c.show);
													return item?.[c.show] ?? "";
												}
											}

											return row[c.key];
										})()}

									</td>
								))}

								<td
									className="
										p-3
										text-left
									"
								>

									<div
										className="
											flex
											gap-2
										"
									>

										<button
											onClick={() =>
												setEditing(row)
											}

											className="
												bg-yellow-600
												hover:bg-yellow-500
												px-3
												py-1
												rounded
											"
										>
											Edit
										</button>

										<button
											onClick={() =>
												setDeleteTarget(row)
											}

											className="
												bg-red-700
												hover:bg-red-600
												px-3
												py-1
												rounded
											"
										>
											Delete
										</button>

									</div>

								</td>

							</tr>

						))}

					</tbody>

				</table>

				{loading && (

					<div
						className="
							text-center
							p-6
							text-zinc-400
						"
					>
						Loading...
					</div>
				)}

			</div>

			{editing && (

				<DkrhCrudModal

					title={title}

					data={editing}

					apiBase={
						getAPIURL(
							apiBase
						)
					}

					fields={fields}

					onClose={() => {

						setEditing(null);

						setOffset(0);

						loadData(
							search,
							true
						);
					}}
				/>
			)}

			{deleteTarget && (

				<DkrhDeleteModal

					title={`Delete ${title}`}

					message={
						`${deleteTarget[deleteLabelColumn]}?`
					}

					onCancel={() =>
						setDeleteTarget(null)
					}

					onConfirm={confirmDelete}
				/>
			)}

		</div>
	);
}
