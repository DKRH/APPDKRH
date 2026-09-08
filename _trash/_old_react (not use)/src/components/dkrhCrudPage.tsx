import { useEffect, useRef, useState } from "react";
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
	const tableRef = useRef<HTMLDivElement>(null);
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

	/*useEffect(() => {

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

	}, [search, loading, offset]);*/

	useEffect(() => {
		const container = tableRef.current;

		if (!container) return;

		function onScroll() {
			const nearBottom =
				container!.scrollTop +
				container!.clientHeight >=
				container!.scrollHeight - 300;

			if (nearBottom && !loading && hasMore) {
				loadData(search, false);
			}
		}

		container.addEventListener("scroll", onScroll);

		return () =>
			container.removeEventListener("scroll", onScroll);
	}, [search, loading, hasMore]);

	return (

		<div
			className="
				h-full
				flex
				flex-col
				bg-zinc-950
				text-zinc-100
				overflow-hidden
			"
		>

			<div
				className="
					flex
					items-center
					justify-between
				"
			>

				<h1
					className="
						text-1xl
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

    outline-none
    focus:border-blue-500
					"
				/>

			</div>

			<div
    			ref={tableRef}
				className="
					flex-1
					overflow-auto
					border
					border-zinc-800
					rounded-lg
					min-h-0
				"
			>
					<table
						className="
							w-full
							min-w-max
							text-sm
						"
					>

						<thead
							className="
								sticky
        						top-0
								z-30
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
										sticky
										top-0
										right-0
										bg-zinc-900
										p-3
										text-left
										z-40
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
											sticky
											right-0
											bg-zinc-950
											p-3
											text-left
											z-20
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
