const trPlayers = [
	"Ghost",
	"Raven",
	"",
	"",
	"",
	"",
];

const ctPlayers = [
	"Nova",
	"Zero",
	"",
	"",
	"",
	"",
];

function Slot({
	name,
}: {
	name: string;
}) {

	return (

	<button className="
		w-full
		h-12

		bg-zinc-800
		hover:bg-zinc-700

		border
		border-zinc-700

		rounded-lg

		text-left
		px-3

		transition
	">

		{name || "EMPTY SLOT"}

	</button>
	);
}

export default function RoomPage() {

	return (

	<div className="
		min-h-screen
		bg-zinc-950
		text-white

		flex
		flex-col
	">

		{/* TOP */}

		<div className="
			flex-1

			grid
			grid-cols-2
			gap-6

			p-6
		">

			{/* TR */}

			<div className="
				bg-zinc-900
				border
				border-red-900
				rounded-xl
				p-4
			">

				<h2 className="
					text-2xl
					font-bold
					text-red-400
					mb-4
				">
					TR
				</h2>

				<div className="
					flex
					flex-col
					gap-3
				">

					{trPlayers.map((p, i) => (
						<Slot
							key={i}
							name={p}
						/>
					))}

				</div>

			</div>

			{/* CT */}

			<div className="
				bg-zinc-900
				border
				border-blue-900
				rounded-xl
				p-4
			">

				<h2 className="
					text-2xl
					font-bold
					text-blue-400
					mb-4
				">
					CT
				</h2>

				<div className="
					flex
					flex-col
					gap-3
				">

					{ctPlayers.map((p, i) => (
						<Slot
							key={i}
							name={p}
						/>
					))}

				</div>

			</div>

		</div>

		{/* CHAT */}

		<div className="
			h-[220px]

			bg-zinc-900
			border-t
			border-zinc-800

			p-4

			flex
			flex-col
		">

			<div className="
				flex-1
				overflow-y-auto
				text-sm
				text-zinc-300
				mb-3
			">

				<div>
					Ghost: ready?
				</div>

				<div>
					Nova: go go go
				</div>

			</div>

			<div className="
				flex
				gap-3
			">

				<input
					type="text"
					placeholder="Type message..."

					className="
						flex-1

						bg-zinc-800
						p-3
						rounded-lg
						outline-none
					"
				/>

				<button className="
					bg-blue-600
					hover:bg-blue-500
					transition

					px-5
					rounded-lg
				">
					SEND
				</button>

			</div>

		</div>

	</div>
	);
}