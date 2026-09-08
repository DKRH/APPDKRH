const servers = [

	{
		id: 1,
		mode: "TDM",
		map: "dm_lockdown",
		name: "Asia TDM #1",
		lock: false,
		players: "8/12",
	},

	{
		id: 2,
		mode: "INF",
		map: "inf_lab",
		name: "Infection SEA",
		lock: true,
		players: "14/24",
	},
];

export default function ServerBrowserPage() {

	return (

	<div className="
		min-h-screen
		bg-zinc-950
		text-white

		p-4

		flex
		gap-4
	">

		{/* LEFT PANEL */}

		<div className="
			w-[250px]

			bg-zinc-900
			border
			border-zinc-800
			rounded-xl

			p-4

			flex
			flex-col
			gap-4
		">

			{/* PROFILE */}

			<div className="
				h-[180px]

				bg-zinc-800
				border
				border-zinc-700
				rounded-lg

				flex
				items-center
				justify-center

				shrink-0
			">

				PROFILE

			</div>

			{/* CHAT */}

			<div className="
				flex-1

				bg-zinc-800
				border
				border-zinc-700
				rounded-lg

				flex
				flex-col

				overflow-hidden
			">

				{/* CHAT MESSAGES */}

				<div className="
					flex-1

					p-3

					overflow-y-auto

					text-sm
					text-zinc-300
				">

					<div className="mb-2">
						Ghost:
						{" "}
						ready?
					</div>

					<div className="mb-2">
						Nova:
						{" "}
						go go go
					</div>

				</div>

				{/* CHAT INPUT */}

				<div className="
					border-t
					border-zinc-700

					p-2
				">

					<input
						type="text"
						placeholder="Type message..."

						className="
							w-full

							bg-zinc-900
							border
							border-zinc-700

							rounded-lg

							p-2

							outline-none
						"
					/>

				</div>

			</div>

		</div>

		{/* RIGHT PANEL */}

		<div className="
			flex-1

			bg-zinc-900
			border
			border-zinc-800
			rounded-xl

			flex
			flex-col
		">

			{/* HEADER */}

			<div className="
				grid
				grid-cols-[60px_100px_160px_1fr_80px_100px]

				bg-zinc-800

				text-sm
				font-bold

				border-b
				border-zinc-700

				p-3
			">

				<div>ID</div>
				<div>MODE</div>
				<div>MAP</div>
				<div>NAME</div>
				<div>LOCK</div>
				<div>PLAYER</div>

			</div>

			{/* SERVER LIST */}

			<div className="
				flex-1
				overflow-y-auto
			">

				{servers.map(server => (

					<button
						key={server.id}

						className="
							w-full

							grid
							grid-cols-[60px_100px_160px_1fr_80px_100px]

							text-center

							p-3

							border-b
							border-zinc-800

							hover:bg-zinc-800

							transition
						"
					>

						<div>
							{server.id}
						</div>

						<div>
							{server.mode}
						</div>

						<div>
							{server.map}
						</div>

						<div>
							{server.name}
						</div>

						<div>
							{server.lock
								? "🔒"
								: "-"}
						</div>

						<div>
							{server.players}
						</div>

					</button>

				))}

			</div>

			{/* BOTTOM BUTTONS */}

			<div className="
				h-[70px]

				border-t
				border-zinc-800

				grid
				grid-cols-4
				gap-2

				p-2
			">

				<button className="
					bg-zinc-800
					hover:bg-zinc-700
					rounded-lg
				">
					CREATE ROOM
				</button>

				<button className="
					bg-zinc-800
					hover:bg-zinc-700
					rounded-lg
				">
					LOADOUT
				</button>

				<button className="
					bg-zinc-800
					hover:bg-zinc-700
					rounded-lg
				">
					SETTING
				</button>

				<button className="
					bg-zinc-800
					hover:bg-zinc-700
					rounded-lg
				">
					QUIT
				</button>

			</div>

		</div>

	</div>
	);
}