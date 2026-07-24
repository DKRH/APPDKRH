import {
	useState,
	useEffect,
} from "react";

import {
	useNavigate,
} from "react-router-dom";
import { backendurl } from "@/config";
import { authClient } from "@/lib/auth";

export default function RegisterPage() {

	const navigate =
		useNavigate();

	const [username, setUsername] =
		useState("");

	const [email, setEmail] =
		useState("");

	const [password, setPassword] =
		useState("");

	const [error, setError] =
		useState("");

	const [success, setSuccess] =
		useState("");

	const [loading, setLoading] =
		useState(false);



	useEffect(() => {

		if (!error && !success)
			return;

		const timer =
			setTimeout(() => {

				setError("");
				setSuccess("");

			}, 3000);

		return () =>
			clearTimeout(timer);

	}, [error, success]);



	async function register() {

		setError("");
		setSuccess("");

		setLoading(true);

		try {

			const response =
				await authClient.signUp.email({
					name: username,
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

			setSuccess("Account created");

			setTimeout(() => {

				navigate("/");

			}, 1000);

		}
		catch {

			setError(
				"Cannot connect to server");
		}

		setLoading(false);
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

			{/* ERROR */}

			<div className={`
				bg-red-700
				text-white

				p-2
				rounded-lg

				mb-2
				text-sm

				transition-all
				duration-300

				${error
					? "opacity-100 translate-y-0"
					: "opacity-0 -translate-y-2 pointer-events-none h-0 p-0 mb-0"}
			`}>

				{error || "placeholder"}

			</div>

			{/* SUCCESS */}

			<div className={`
				bg-green-700
				text-white

				p-2
				rounded-lg

				mb-2
				text-sm

				transition-all
				duration-300

				${success
					? "opacity-100 translate-y-0"
					: "opacity-0 -translate-y-2 pointer-events-none h-0 p-0 mb-0"}
			`}>

				{success || "placeholder"}

			</div>

			<input
				type="text"
				placeholder="Username"

				value={username}

				onChange={(e) =>
					setUsername(
						e.target.value)
				}

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
				type="email"
				placeholder="Email"

				value={email}

				onChange={(e) =>
					setEmail(
						e.target.value)
				}

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

				onChange={(e) =>
					setPassword(
						e.target.value)
				}

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
				onClick={register}

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
					disabled:opacity-50
				"
			>

				{loading
					? "CREATING..."
					: "REGISTER"}

			</button>

		</div>

	</div>
	);
}