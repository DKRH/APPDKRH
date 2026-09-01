import { useEffect, useState } from "react";

import DkrhInput from "@/components/dkrhInput";
import { apiFetch, getAPIURL } from "./const";

export function DkrhCrudModal({
	title,
	data = {},
	fields,
	apiBase,
	onClose
}: any) {

	const [form, setForm] = useState(data);
	const [resolvedFields, setResolvedFields] = useState(fields);

	useEffect(() => {
		async function loadFields() {
			const newFields = await Promise.all(
				fields.map(async (field: any) => {

					if (field.options)
						return field;

					if (field.type !== "dropdown" || !field.api)
						return field;

					const res = await apiFetch(
						getAPIURL(field.api)
					);

					const data = await res.json();

					return {
						...field,
						options: data.map((item: any) => ({
							value: item[field.valueField ?? "id"],
							label: item[field.labelField ?? "name"],
						})),
					};
				})
			);

			setResolvedFields(newFields);
		}

		loadFields();
	}, [fields]);

	async function save() {

		const method =
			data.id
				? "PUT"
				: "POST";

		const url =
			data.id
				? `${apiBase}/${data.id}`
				: apiBase;

		await apiFetch(url, {
			method,
			headers: {
				"Content-Type":
					"application/json"
			},
			body: JSON.stringify(form)
		});

		onClose();
	}

	return (

		<div
			className="
				fixed
				inset-0
				bg-black/70
				flex
				items-center
				justify-center
				z-50
			"
		>

			<div
				className="
					bg-zinc-900
					p-6
					rounded-xl
					w-[700px]
					border
					border-zinc-700
				"
			>

				<h2
					className="
						text-2xl
						font-bold
						mb-4
					"
				>
					{
						data.id
							? `Edit ${title}`
							: `Add ${title}`
					}
				</h2>

				<div
					className="
						grid
						grid-cols-2
						gap-4
					"
				>
					{resolvedFields.map((f: any) => {
						const { key, ...props } = f;

						return (
							<DkrhInput
								key={key}
								{...props}
								value={form[key] ?? ""}
								onChange={(v: any) =>
									setForm({
										...form,
										[key]: v,
									})
								}
							/>
						);
					})}
				</div>

				<div
					className="
						flex
						justify-center
						gap-3
						mt-6
					"
				>

					<button
						onClick={onClose}

						className="
							bg-zinc-700
							hover:bg-zinc-600
							px-4
							py-2
							rounded
						"
					>
						Cancel
					</button>

					<button
						onClick={save}

						className="
							bg-blue-600
							hover:bg-blue-500
							px-4
							py-2
							rounded
						"
					>
						Save
					</button>

				</div>

			</div>

		</div>
	);
}