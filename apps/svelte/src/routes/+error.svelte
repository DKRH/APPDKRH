<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	const goHome = () => {
		goto("/");
	};
</script>

<svelte:head>
	<title>{page.status} | Page Not Found</title>
	<meta
		name="description"
		content="The page you're looking for could not be found."
	/>
</svelte:head>

<div class="min-h-screen bg-slate-50 flex items-center justify-center px-6">
	<div class="w-full max-w-lg text-center">
		<!-- Icon -->
		<div
			class="mx-auto mb-8 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
		>
			<svg
				class="h-10 w-10 text-slate-400"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9.5 9.5a3 3 0 1 1 5 2.2c-1.2.9-2.5 1.5-2.5 3"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 18h.01"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7 4h10l4 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M17 4v4h4"
				/>
			</svg>
		</div>

		<!-- Status -->
		<p class="mb-2 text-sm font-semibold uppercase tracking-widest text-slate-400">
			Error {page.status}
		</p>

		<h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
			Page not found
		</h1>

		<p class="mx-auto mt-4 text-base text-slate-500">
			We couldn't find the page you're looking for. It may have been moved,
			removed, or the address may be incorrect.
		</p>

		<p class="mt-10 text-xs text-slate-400 mb-4">
			<b>Requested path:</b> {page.url.pathname}
		</p>
        <!-- Actions -->
        <div class="mt-8 flex flex-row items-center justify-center gap-3">
            <button
                onclick={goHome}
                class="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
            >
                Back to Home
            </button>
            &nbsp;
            <button
                onclick={() => history.back()}
                class="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
            >
                Go Back
            </button>
        </div>
	</div>
</div>