<script lang="ts">
	import { onMount } from 'svelte';

	const API_KEY = 'YOUR_OPENCAGE_API_KEY'; // Replace with your OpenCage API key

	let error: string | null = null;

	onMount(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					fetchLocationName(latitude, longitude);
				},
				(err) => {
					error = err.message;
				}
			);
		} else {
			error = 'Geolocation is not supported by this browser.';
		}
	});

	async function fetchLocationName(latitude: number, longitude: number) {
		const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.results && data.results.length > 0) {
				const locationName = data.results[0].formatted;
				console.log(`Current Location: ${locationName}`);
			} else {
				console.log('No location name found.');
			}
		} catch (error) {
			console.error('Error fetching location name:', error);
		}
	}
</script>

{#if error}
	<p>Error: {error}</p>
{/if}
