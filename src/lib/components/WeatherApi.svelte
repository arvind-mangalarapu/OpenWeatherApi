<script>
	export let city = '';
	export let fetchWeather = false;
	export let onWeatherData = (data) => {};
	export let onError = (error) => {};

	const apiKey = 'ef9c6f39d66bd483aba0aa43fa49473d';

	$: if (fetchWeather) {
		fetchWeatherData();
	}

	async function fetchWeatherData() {
		if (city.trim()) {
			const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
			try {
				const response = await fetch(apiUrl);
				if (!response.ok) {
					throw new Error('City not found');
				}
				const data = await response.json();
				console.log('Weather data:', data); // Log the data to the console
				onWeatherData(data);
			} catch (err) {
				console.error('Error fetching weather data:', err); // Log the error to the console
				onError(err.message);
			}
		}
	}
</script>
