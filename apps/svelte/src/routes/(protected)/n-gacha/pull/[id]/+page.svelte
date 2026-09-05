<script lang="ts">
	//import "$lib/components/gacha/style.css";
	import {
		doGachaPull,
        getGachaState,
	} from "$lib/api/gacha";

	import PullResult from "$lib/components/gacha/PullResult.svelte";

	import type {
		GachaItem,
	} from "$lib/components/gacha/gacha.type";

	import { page } from "$app/state";

	const bannerId = $derived(
		page.params.id,
	);
    
	let rolling = $state(false);

	let results = $state<GachaItem[]>([]);

	let pity5 = $state(0);
	let pity4 = $state(0);
	let soft = $state(75);
	let hard = $state(90);
	let guarantee5 = $state(0);
	let items = $state<GachaItem[]>([]);

	let showSky = $state(false);

	async function loadGachaState() {
		if (!bannerId) {
			return;
		}

		try {
			const response = await getGachaState(bannerId);

			pity5 = response.pity.pity5;
			pity4 = response.pity.pity4;
			soft = response.banner.soft;
			hard = response.banner.hard;
			guarantee5 = response.pity.guarantee5;
			items = response.item;
		} catch (err) {
			console.error("Failed to load gacha state:", err);
		}
	}
	$effect(() => {
		if (bannerId) {
			loadGachaState();
		}
	});

	async function doPullAction(
		count = 1,
	) {
		if (rolling) {
			return;
		}
		if (!bannerId) {
			console.error("Banner ID is missing");
			return;
		}

		rolling = true;

		try {
			const response = await doGachaPull(
					bannerId,
					count,
				);
			
			console.log("response:", response);
			console.log("response.pity:", response.pity);
			console.log("pity5:", response.pity.pity5);
			results = response.results;

			pity5 = response.pity.pity5;
			pity4 = response.pity.pity4;

			soft = response.banner.soft;

			hard = response.banner.hard;

			guarantee5 = response.pity.guarantee5;

			if (
				response.results.some(
					(item) =>
						item.rarity === 5,
				)
			) {
				showSky = true;

				setTimeout(() => {
					showSky = false;
				}, 700);
			}
		} catch (err) {
			console.error(
				"Gacha pull failed:",
				err,
			);
		} finally {
			rolling = false;
		}
	}
	
	let pct = $derived(
		Math.min((pity5 / hard) * 100, 100),
	);
</script>

<svelte:head>
	<title>Gacha Pull</title>
</svelte:head>

<div
	class="gacha-stage"
	class:shake={showSky}
>
	<div class="gacha-info">
		<div class="item-list">
			<div class="item-list-title">
				Banner Items
			</div>

			<div class="item-grid">
				{#each items as item}
					<div class="item">
						<span class="item-name">{item.name}</span>
						<span class="item-rarity">{item.rarity}★</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="pity-panel">
			<div class="pity-header">
				<div>
					<div class="pity-label">5★ Pity</div>
					<div class="pity-count">
						{pity5}
						<span>/ {hard} pulls</span>
					</div>
				</div>

				<div class="guarantee-badge">
					<span>Next 5★</span>

					<strong class:guaranteed={guarantee5}>
						{guarantee5 ? "GUARANTEED" : "50 / 50"}
					</strong>
				</div>
			</div>

			<div class="pity-progress">
				<div
					class="pity-bar"
					style={`width: ${pct}%`}
				></div>
			</div>

			<div class="pity-footer">
				<div>
					<span>4★ Pity</span>
					<strong>{pity4}</strong>
				</div>

				<div>
					<span>5★ Pity</span>
					<strong>{pity5}</strong>
				</div>

				<div>
					<span>Soft Pity</span>
					<strong>{soft}</strong>
				</div>

				<div>
					<span>Hard Pity</span>
					<strong>{hard}</strong>
				</div>
			</div>
		</div>
	</div>

	<div class="actions">
		<button
			class="summon-button"
			disabled={rolling}
			onclick={() => doPullAction(1)}
		>
			<span class="summon-title">Summon</span>
			<span class="summon-subtitle">1 Pull</span>
		</button>

		<button
			class="summon-button summon-ten"
			disabled={rolling}
			onclick={() => doPullAction(10)}
		>
			<span class="summon-title">Summon ×10</span>
			<span class="summon-subtitle">10 Pulls</span>
		</button>
	</div>

	{#if rolling}
		<div class="orb"></div>
	{/if}

	<PullResult {results} />

	{#if showSky}
		<div class="flash-overlay"></div>
		<div class="crack"></div>
	{/if}
</div>

<style>

.gacha-stage {
	max-width: 900px;
	margin: auto;
	padding: 40px 20px;
	text-align: center;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
.orb {
	margin: 40px auto;
	width: 120px;
	height: 120px;
	border-radius: 50%;
	position: relative;
	background:
		radial-gradient(circle at 30% 30%, #9ff, #00f 70%),
		conic-gradient(from 0deg, #6ff, #00f, #6ff, #00f);
	box-shadow: 0 0 40px #6ff;
	animation: spin 1.4s linear infinite;
	overflow: hidden;
}
.orb::after {
	content: "";
	position: absolute;
	inset: 12px;
	border-radius: 50%;
	background: radial-gradient(circle, #00f, #001);
}

@keyframes flash {
	0% {
		opacity: 0;
	}
	20% {
		opacity: 0.8;
	}
	100% {
		opacity: 0;
	}
}
.flash-overlay {
	position: fixed;
	inset: 0;
	background: radial-gradient(circle, #fff, #9df, #00f);
	pointer-events: none;
	animation: flash 0.6s ease;
}

.crack {
	position: fixed;
	inset: 0;
	background:
		linear-gradient(130deg, transparent 45%, #9df 50%, transparent 55%),
		linear-gradient(20deg, transparent 45%, #9df 50%, transparent 55%);
	opacity: 0.6;
	pointer-events: none;
}

@keyframes quake {
	0% {
		transform: translate(0, 0);
	}
	20% {
		transform: translate(-6px, 4px);
	}
	40% {
		transform: translate(6px, -4px);
	}
	60% {
		transform: translate(-5px, 3px);
	}
	80% {
		transform: translate(4px, -3px);
	}
	100% {
		transform: translate(0, 0);
	}
}
.shake {
	animation: quake 0.45s ease;
}
.pity-shell {
    width: 100%;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 14px;
    overflow: hidden;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow:
        0 8px 30px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
.gacha-info {
	display: grid;
	grid-template-columns: 1fr;
	gap: 14px;
	margin-bottom: 24px;
}

.item-list,
.pity-panel {
	background: rgba(255, 255, 255, 0.055);
	border: 1px solid rgba(255, 255, 255, 0.14);
	border-radius: 16px;
	backdrop-filter: blur(14px);
	-webkit-backdrop-filter: blur(14px);
	box-shadow:
		0 8px 30px rgba(0, 0, 0, 0.2),
		inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.item-list {
	padding: 14px;
}

.item-list-title {
	margin-bottom: 10px;
	font-size: 12px;
	font-weight: 600;
	text-align: left;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	color: rgba(255, 255, 255, 0.5);
}

.item-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	gap: 8px;
}

.item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 10px 12px;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.045);
	border: 1px solid rgba(255, 255, 255, 0.08);
}

.item-name {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 13px;
}

.item-rarity {
	font-size: 12px;
	color: #ffd700;
	white-space: nowrap;
}

.pity-panel {
	padding: 18px;
}

.pity-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
}

.pity-label {
	margin-bottom: 2px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	color: rgba(255, 255, 255, 0.45);
}

.pity-count {
	font-size: 24px;
	font-weight: 700;
}

.pity-count span {
	font-size: 13px;
	font-weight: 400;
	color: rgba(255, 255, 255, 0.45);
}

.guarantee-badge {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 3px;
}

.guarantee-badge span {
	font-size: 11px;
	color: rgba(255, 255, 255, 0.45);
}

.guarantee-badge strong {
	font-size: 13px;
	color: #ffc857;
}

.guarantee-badge strong.guaranteed {
	color: #ffd700;
	text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.pity-progress {
	height: 10px;
	margin-top: 14px;
	overflow: hidden;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.08);
}

.pity-bar {
	height: 100%;
	border-radius: inherit;
	background: linear-gradient(
		90deg,
		#4aa3ff,
		#a55cff,
		#ffd700
	);
	box-shadow: 0 0 14px rgba(165, 92, 255, 0.45);
	transition: width 0.5s ease;
}

.pity-footer {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
	margin-top: 14px;
}

.pity-footer > div {
	display: flex;
	flex-direction: column;
	gap: 3px;
	padding: 9px;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.035);
}

.pity-footer span {
	font-size: 10px;
	color: rgba(255, 255, 255, 0.4);
}

.pity-footer strong {
	font-size: 14px;
}

@media (max-width: 600px) {
	.pity-header {
		align-items: flex-start;
	}

	.pity-footer {
		grid-template-columns: repeat(2, 1fr);
	}

	.item-grid {
		grid-template-columns: 1fr;
	}
}
.actions {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 220px));
	justify-content: center;
	gap: 12px;
	margin: 20px auto 28px;
}

.summon-button {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 3px;

	min-height: 64px;
	padding: 12px 20px;

	border: 1px solid rgba(255, 255, 255, 0.18);
	border-radius: 14px;

	background:
		linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.11),
			rgba(255, 255, 255, 0.045)
		);

	color: #eaeaff;
	font: inherit;

	cursor: pointer;

	box-shadow:
		0 8px 25px rgba(0, 0, 0, 0.2),
		inset 0 1px 0 rgba(255, 255, 255, 0.08);

	transition:
		transform 0.2s ease,
		background 0.2s ease,
		box-shadow 0.2s ease,
		border-color 0.2s ease;
}

.summon-title {
	font-size: 15px;
	font-weight: 700;
}

.summon-subtitle {
	font-size: 11px;
	color: rgba(255, 255, 255, 0.45);
}

.summon-button:hover:not(:disabled) {
	transform: translateY(-2px);

	background:
		linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.16),
			rgba(255, 255, 255, 0.07)
		);

	border-color: rgba(165, 92, 255, 0.5);

	box-shadow:
		0 10px 30px rgba(0, 0, 0, 0.3),
		0 0 20px rgba(165, 92, 255, 0.18);
}

.summon-button:active:not(:disabled) {
	transform: translateY(1px);
}

.summon-button:disabled {
	opacity: 0.45;
	cursor: not-allowed;
	transform: none;
}

/* 10-pull gets a little extra emphasis */
.summon-ten {
	border-color: rgba(255, 215, 0, 0.28);

	background:
		linear-gradient(
			180deg,
			rgba(255, 215, 0, 0.10),
			rgba(255, 255, 255, 0.045)
		);
}

.summon-ten:hover:not(:disabled) {
	border-color: rgba(255, 215, 0, 0.55);

	box-shadow:
		0 10px 30px rgba(0, 0, 0, 0.3),
		0 0 24px rgba(255, 215, 0, 0.18);
}

.summon-ten .summon-title {
	color: #ffd700;
}

@media (max-width: 500px) {
	.actions {
		grid-template-columns: 1fr;
	}
}
</style>