<script lang="ts">
	import type { DanmuItem } from './stores'
	export let item: DanmuItem
	//
</script>

<div class="danmu">
	{@html item.msg}
</div>

<style>
	.danmu :global(img.bulge-1),
	.danmu :global(img.bulge-0) {
		width: auto;
	}
	.danmu :global(img.bulge-1) {
		height: 50px;
	}
	.danmu :global(img.bulge-0) {
		height: 30px;
	}
</style>
