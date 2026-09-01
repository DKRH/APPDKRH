export function DkrhDeleteModal({
	title = "Delete Data",
	message,
	onCancel,
	onConfirm
}: any) {

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
					border
					border-zinc-700
					rounded-xl
					p-6
					w-[400px]
				"
			>

				<h2
					className="
						text-xl
						font-bold
						mb-3
					"
				>
					{title}
				</h2>

				<p
					className="
						text-zinc-400
						mb-6
					"
				>
					Delete{" "}

					<span
						className="
							text-red-400
							font-bold
						"
					>
						{message}
					</span>

				</p>

				<div
					className="
						flex
						justify-center
						gap-3
						mt-6
					"
				>

					<button
						onClick={onCancel}

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
						onClick={onConfirm}

						className="
							bg-red-700
							hover:bg-red-600
							px-4
							py-2
							rounded
						"
					>
						Delete
					</button>

				</div>

			</div>

		</div>
	);
}

