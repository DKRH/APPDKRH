export default function DkrhModal({
	title,
	children,
	onClose,
	onSave,
	saveText = "Save"
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
					p-6
					rounded-xl
					w-[700px]
					border
					border-zinc-700
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

					<h2
						className="
							text-2xl
							font-bold
						"
					>
						{title}
					</h2>

					<button
						onClick={onClose}

						className="
							text-zinc-400
							hover:text-white
						"
					>
						✕
					</button>

				</div>

				{children}

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
						onClick={onSave}

						className="
							bg-blue-600
							hover:bg-blue-500
							px-4
							py-2
							rounded
						"
					>
						{saveText}
					</button>

				</div>

			</div>

		</div>
	);
}