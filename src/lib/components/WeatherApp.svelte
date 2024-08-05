<script>
	import WeatherApi from './WeatherApi.svelte';

	let city = '';
	let weatherData = null;
	let error = null;
	let fetchWeather = false;

	function searchWeather() {
		if (city.trim()) {
			city = capitalizeCity(city);
			fetchWeather = true;
			setTimeout(() => (fetchWeather = false), 100);
		}
	}

	function handleWeatherData(data) {
		weatherData = data;
		error = null;
	}

	function handleError(err) {
		error = err;
		weatherData = null;
	}

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			searchWeather();
		}
	}

	function capitalizeCity(name) {
		return name
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

	function getWeatherIcon(condition) {
		switch (condition) {
			case 'Clear':
				return 'images/clear.png';
			case 'Clouds':
				return 'images/clouds.png';
			case 'Drizzle':
				return 'images/drizzle.png';
			case 'Mist':
				return 'images/mist.png';
			case 'Rain':
				return 'images/rain.png';
			case 'Snow':
				return 'images/snow.png';
			default:
				return 'images/clouds.png'; // Fallback image
		}
	}
</script>

<main class="h-[100vh] w-[100vw] bg-black">
	<div
		class="w-[90%] max-w-[470px] bg-gradient-to-tr from-[#00feba] to-[#5b548a] mx-auto text-[#fff] rounded-[20px] py-[40px] px-[35px] text-center"
	>
		<div class="w-full flex justify-between items-center">
			<input
				bind:value={city}
				class="border-none outline-none bg-[#ebfffc] text-[#555] py-[10px] px-[25px] h-[60px] rounded-[30px] flex-1 mr-[16px] text-[18px]"
				placeholder="Enter city name"
				spellcheck="false"
				on:keydown={handleKeyDown}
			/>
			<button
				class="border-none outline-none bg-[#ebfffc] rounded-[50%] w-[60px] h-[60px] cursor-pointer flex justify-center items-center"
				on:click={searchWeather}
			>
				<img class="w-[16px]" src="images/search.png" alt="search" />
			</button>
		</div>

		{#if fetchWeather}
			<WeatherApi {city} {fetchWeather} onWeatherData={handleWeatherData} onError={handleError} />
		{/if}

		{#if error}
			<p class="capitalize">{error}</p>
		{:else if weatherData}
			<div class="w-full mt-[50px] flex flex-col items-center">
				<img
					class="w-[170px] mt-[30px]"
					src={getWeatherIcon(weatherData.weather[0].main)}
					alt="weather icon"
				/>
				<h1 class="text-[80px] capitalize">{weatherData.main.temp}°C</h1>
				<h2 class="text-[45px] capitalize">{weatherData.name}</h2>
				<div class="w-[100%] flex items-center justify-between mt-[50px]">
					<div class="flex items-center text-left">
						<img class="w-[40px] mr-[10px]" src="images/humidity.png" alt="humidity" />
						<div>
							<p class="text-[28px] capitalize">{weatherData.main.humidity}%</p>
							<p class="text-[28px] capitalize">Humidity</p>
						</div>
					</div>
					<div class="flex items-center text-left">
						<img class="w-[40px] mr-[10px]" src="images/wind.png" alt="wind" />
						<div>
							<p class="text-[28px] capitalize">{weatherData.wind.speed} km/h</p>
							<p class="text-[28px] capitalize">Wind Speed</p>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<p class="capitalize mt-5 text-left ml-5">Enter a city name to get the weather.</p>
		{/if}
	</div>
</main>
