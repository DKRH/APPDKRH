import { useRef, useState } from "react";

export default function DkrhDateInput({
	label,
	value,
	onChange,
}: any) {
	const pickerRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState("");

	function format(v: string) {
		const digits = v.replace(/\D/g, "").slice(0, 8);

		if (digits.length <= 2)
			return digits;

		if (digits.length <= 4)
			return `${digits.slice(0, 2)}-${digits.slice(2)}`;

		return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
	}

	function isValid(date: string) {
		if (!/^\d{2}-\d{2}-\d{4}$/.test(date))
			return false;

		const [d, m, y] = date.split("-").map(Number);

		const dt = new Date(y, m - 1, d);

		return (
			dt.getFullYear() === y &&
			dt.getMonth() === m - 1 &&
			dt.getDate() === d
		);
	}

	function fromISO(date: string) {
		if (!date)
			return "";

		const [y, m, d] = date.split("-");

		return `${d}-${m}-${y}`;
	}

	function toISO(date: string) {
		if (!date || !isValid(date))
			return "";

		const [d, m, y] = date.split("-");

		return `${y}-${m}-${d}`;
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

			<div className="relative">

				<input
					type="text"
					placeholder="dd-mm-yyyy"
					value={value ?? ""}
					onChange={(e) => {

						const v = format(e.target.value);

						onChange(v);

						if (
							v.length === 10 &&
							!isValid(v)
						)
							setError("Invalid date");
						else
							setError("");
					}}
					className={`
						w-full
						bg-zinc-800
						border
						rounded
						px-3
						py-2
						pr-10
						${error
							? "border-red-500"
							: "border-zinc-700"}
					`}
				/>

				<input
					ref={pickerRef}
					type="date"
					value={toISO(value)}
					onChange={(e) =>
						onChange(fromISO(e.target.value))
					}
					className="
						absolute
						right-2
						top-1/2
						-translate-y-1/2
						w-6
						h-6
						opacity-0
						cursor-pointer
					"
				/>

				<div
					className="
						absolute
						right-2
						top-1/2
						-translate-y-1/2
						w-6
						h-6
						flex
						items-center
						justify-center
						pointer-events-none
						select-none
						text-lg
					"
				>
					📅
				</div>

			</div>

			{error && (
				<p
					className="
						mt-1
						text-xs
						text-red-500
					"
				>
					⚠ {error}
				</p>
			)}

		</div>
	);
}