<script lang="ts">
	import type { GuardItem } from './stores'
	export let item: GuardItem
	$: gift = item.gift
	import { GiftValue } from './gift.svelte'
	//
</script>

<div class="guard">
	<div>{item.nickname}开通了{gift.name}x{gift.num}</div>
	<div>{GiftValue(gift.value)}</div>
</div>

<style>
	.guard {
		display: inline-block;
		border: 1px solid;
		padding: 1rem 1.5rem;
		border-radius: 0.5rem;
	}
</style>
