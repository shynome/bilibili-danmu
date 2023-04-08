<script lang="ts">
	import type { SuperChatItem } from './stores'
	export let item: SuperChatItem
	//
</script>

<div class="sc">
	<div class="face">
		<img src={item.face} alt={item.nickname} referrerpolicy="no-referrer" width="40" height="40" />
	</div>
	<div class="right">
		<div class="price">
			SC {item.price}元
		</div>
		<div class="msg">
			{item.msg}
		</div>
	</div>
</div>

<style>
	.sc {
		display: inline-flex;
		align-items: center;
		padding: 1rem 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid;
	}
	.face {
		font-size: 0;
		margin-right: 1rem;
		min-width: 40px;
	}
</style>
