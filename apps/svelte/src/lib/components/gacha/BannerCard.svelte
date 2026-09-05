<script lang="ts">
	import type { GachaBanner } from "./gacha.type";

	let {
		banner,
	}: {
		banner: GachaBanner;
	} = $props();
</script>

<a
	class="banner"
	href={`/n-gacha/pull/${banner.id}`}
>
	<h2>{banner.name}</h2>

	<p>
		5★ Rate Up: {banner.uprate5}%
	</p>

	<p>
		4★ Rate Up: {banner.uprate4}%
	</p>
</a>

<style>
.banner {
	background: linear-gradient(160deg, #11172e, #090b18);
	border: 1px solid #2b2f55;
	border-radius: 14px;
	padding: 18px;
	cursor: pointer;
	transition: 0.3s ease;
}
.banner:hover {
	transform: scale(1.04);
	box-shadow: 0 0 25px rgba(120, 130, 255, 0.35);
}
</style>