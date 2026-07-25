import { useState,useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth";

export default function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	
	useEffect(() => {
		if (!error) return;

		const timer = setTimeout(() => {
			setError("");
		}, 3000);

		return () => clearTimeout(timer);
	}, [error]);

	async function login() {
		setError("");
		setLoading(true);
		try {
			const response = await authClient.signIn.email({
				email,
				password,
			});

			if (response.error) {
				setError(
					response.error.message
				);
				setLoading(false);
				return;
			}

			// SUCCESS
			navigate("/dashboard");
		}
		catch (err) {
			setError("Cannot connect to server");
			setLoading(false);
		}
	}

	return (
		<div className="
			min-h-screen
			bg-zinc-950
			text-white

			flex
			items-center
			justify-center
		">

			<div className="
				w-[250px]
				bg-zinc-500
				border
				border-zinc-800
				p-4
				rounded-xl
			">
				{/* ERROR POPUP */}

				{error && (

					<div className={`
						bg-red-700
						text-white
						p-2
						rounded-lg
						mb-3
						text-sm
						transition-all
						duration-500
						${error
							? "opacity-100 translate-y-0"
							: "opacity-0 -translate-y-2 pointer-events-none"}
					`}>

						{error || "placeholder"}

					</div>
				)}

				<input
					type="text"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail( e.target.value) }
					className="
						w-full
						bg-zinc-800
						p-2
						rounded-lg
						mb-2
						outline-none
					"
				/>

				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value) }
					className="
						w-full
						bg-zinc-800
						p-2
						rounded-lg
						mb-2
						outline-none
					"
				/>

				<button
					onClick={login}
					disabled={loading}
					className="
						w-full
						bg-zinc-600
						hover:bg-zinc-800
						transition
						p-2
						rounded-lg
						font-semibold
						cursor-pointer
					"
				>
					{loading ? "LOADING..." : "LOGIN"}
				</button>

			</div>

		</div>
	);
}