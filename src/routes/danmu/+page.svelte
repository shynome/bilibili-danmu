<script lang="ts">
	import { page } from '$app/stores'
	import { Live, Danmu } from './stores'
	const live = Live($page.url.searchParams.get('roomid') as any)
	const danmu = Danmu(live)
	import Trigger from './trigger.svelte'
	import { dev } from '$app/environment'
	import DanmuMsg from './danmu.svelte'
	import SuperChatMsg from './superchat.svelte'
	import GiftMsg from './gift.svelte'
	import type { GiftsMap } from './+page'
	export let data: { gifts: GiftsMap }
	//
</script>

<div class="container">
	{#if dev && $live}
		<Trigger live={$live} />
	{/if}
	<ol class="root">
		<li class="item">
			<div class="user">
				<a href="http://github.com/shynome">tip</a>
			</div>
			<div class="msg">弹幕已就绪</div>
		</li>
		{#each $danmu as d}
			<li class="item">
				<div class="user">
					<a href="https://space.bilibili.com/{d.uid}/" target="_blank">{d.nickname}</a>
				</div>
				<div class="msg">
					{#if d.type === 'sc'}
						<SuperChatMsg item={d} />
					{:else if d.type === 'gift'}
						<GiftMsg gifts={data.gifts} item={d} />
					{:else if d.type === 'danmu'}
						<DanmuMsg item={d} />
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</div>

<style>
	.root {
		display: flex;
		flex-direction: column-reverse;
	}
	.root .item {
		display: inline-flex;
		align-items: center;
	}
	.user::after {
		content: ':';
	}
	.msg {
		padding: 0 1rem;
		flex-grow: 1;
	}
</style>
