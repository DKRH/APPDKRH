import DkrhDateInput from "./input/date";

export default function DkrhInput({
	label,
	value,
	onChange,
	type = "text",
    options = [],
}: any) {

	if (type === "date") {
		return (
			<DkrhDateInput
				label={label}
				value={value}
				onChange={onChange}
			/>
		);
	}

	if (type === "dropdown") {
		return (
			<div>

				<label
					className="
						block
						text-sm
						mb-1
						text-zinc-400
					"
				>
					{label}
				</label>

				<select
					value={value ?? ""}
					onChange={(e) =>
						onChange(e.target.value)
					}
					className="
						w-full
						bg-zinc-800
						border
						border-zinc-700
						rounded
						px-3
						py-2
					"
				>
					<option value="">
						Select...
					</option>

					{options.map((o: any) => (
						<option
							key={o.value}
							value={o.value}
						>
							{o.label}
						</option>
					))}
				</select>

			</div>
		);
	}

	return (
		<div>

			<label
				className="
					block
					text-sm
					mb-1
					text-zinc-400
				"
			>
				{label}
			</label>

			<input
				type={type}
				value={value ?? ""}
				onChange={(e) =>
					onChange(
						type === "number"
							? Number(e.target.value)
							: e.target.value
					)
				}
				className="
					w-full
					bg-zinc-800
					border
					border-zinc-700
					rounded
					px-3
					py-2
				"
			/>

		</div>
	);
}