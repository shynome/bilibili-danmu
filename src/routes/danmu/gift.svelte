<script context="module" lang="ts">
	const GiftValue = (v: number): string => {
		return (v / 1e3).toLocaleString(undefined, { minimumFractionDigits: 2 })
	}
</script>

<script lang="ts">
	import type { GiftItem } from './stores'

	export let item: GiftItem
	$: gift = item.gift
	$: box = item.box

	import type { GiftsMap } from './+page'
	export let gifts: GiftsMap
	//
</script>

<div class="gift">
	<div class="box">
		<div class="img">
			<img
				title="单价: {GiftValue(gift.price)}"
				src={gifts[gift.id].webp}
				alt={gift.name}
				width="60"
				height="60"
				referrerpolicy="no-referrer"
			/>
		</div>
		<div class="price">
			<div>{gift.name} x{gift.num}</div>
			<div>{GiftValue(gift.value)}</div>
		</div>
	</div>
	{#if box}
		<div class="box">
			<div class="img">
				<img
					title="单价: {GiftValue(box.price)}"
					src={gifts[box.id].webp}
					alt={box.name}
					width="60"
					height="60"
					referrerpolicy="no-referrer"
				/>
			</div>
			<div class="price">
				<div>{box.name}x{box.num}</div>
				<div>{GiftValue(box.value)}</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.gift {
		display: flex;
		/* padding: 1rem; */
	}
	.img {
		font-size: 0;
	}
	.box {
		display: inline-flex;
		margin-right: 1rem;
		align-items: center;
	}
	.box:last-child {
		margin-right: 0;
	}
</style>
