<script>
	import Custom from './Custom.svelte';
</script>

<h1>
	{#each [1, 2] as item (item)}
		yeah
	{/each}
	<Custom>
		{#slot block}
			hello
			<b>dear</b>
			Yannick!
		{/slot}
	</Custom>
</h1>
