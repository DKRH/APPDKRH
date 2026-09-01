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