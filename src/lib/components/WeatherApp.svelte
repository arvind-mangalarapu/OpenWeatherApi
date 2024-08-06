<script lang="ts">
	import { onMount } from 'svelte';
	import { imageStore } from '../../stores/imageStore';
	import WeatherApi from './WeatherApi.svelte';

	let city = '';
	let weatherData = null;
	let error = null;
	let fetchWeather = false;
	let weatherIcons = [];
	let images = [];

	onMount(() => {
		weatherIcons = [
			getWeatherIcon('Clear'),
			getWeatherIcon('Clouds'),
			getWeatherIcon('Drizzle'),
			getWeatherIcon('Mist'),
			getWeatherIcon('Rain'),
			getWeatherIcon('Snow'),
			getWeatherIcon('Default')
		];

		imageStore.generateImages(weatherIcons);

		// Subscribe to the image store
		imageStore.subscribe((data) => {
			images = data;
		});
	});

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
				return 'images/clouds.png';
		}
	}
</script>

<main class="h-[100vh] w-[100vw] bg-black text-black pt-[20%]" id="main">
	<div
		id="background"
		class="relative w-[90%] max-w-[470px] backdrop-blur-[20px] bg-cover bg-left bg-no-repeat mx-auto text-[#fff] rounded-[20px] py-[40px] px-[35px] text-center overflow-hidden bg-orange-500"
	>
		{#each images as img}
			<div
				class="background-image"
				style="
					background-image: url({img.src});
					width: {img.width}px;
					height: {img.height}px;
					top: {img.top}%;
					left: {img.left}%;
					animation-duration: {img.duration}s;
				"
			></div>
		{/each}

		<div class="w-full flex justify-evenly sm:justify-between items-center gap-3">
			<button>
				<img
					id="animated-svg"
					class="w-[15px] sm:w-[30px] fill-white"
					src="images/location.svg"
					alt="location icon"
				/>
			</button>
			<input
				bind:value={city}
				class="border-none outline-none bg-[#ebfffc] text-[#000] py-[5px] px-[15px] sm:py-[10px] sm:px-[25px] h-[30px] sm:h-[60px] rounded-[30px] flex-1 text-[12px] sm:text-[18px] z-50"
				placeholder="Enter city name"
				spellcheck="false"
				on:keydown={handleKeyDown}
			/>
			<button
				class="border-none outline-none bg-[#ebfffc] rounded-[50%] w-[30px] h-[30px] sm:w-[60px] sm:h-[60px] cursor-pointer flex justify-center items-center"
				on:click={searchWeather}
				aria-label="Search"
			>
				<img class="w-[15px]" src="images/search.png" alt="search icon" />
			</button>
		</div>

		{#if fetchWeather}
			<WeatherApi {city} {fetchWeather} onWeatherData={handleWeatherData} onError={handleError} />
		{/if}

		{#if error}
			<p class="capitalize text-red-500">{error}</p>
		{:else if weatherData}
			<div class="w-full mt-[50px] flex flex-col items-center">
				<img
					class="w-[170px] mt-[30px]"
					src={getWeatherIcon(weatherData.weather[0].main)}
					alt="weather icon"
				/>
				<p></p>
				<h1 class="text-[80px] capitalize">{weatherData.main.temp}°C</h1>
				<h2 class="text-[45px] capitalize">{weatherData.name}</h2>

				<div class="w-[100%] flex items-center justify-evenly sm:justify-between mt-[50px]">
					<div class="flex items-center text-left">
						<img
							class="w-[20px] sm:w-[40px] mr-[10px]"
							src="images/humidity.png"
							alt="humidity icon"
						/>
						<div>
							<p class="text-[13px] sm:text-[28px]">{weatherData.main.humidity}%</p>
							<p class="text-[13px] sm:text-[28px] capitalize">Humidity</p>
						</div>
					</div>
					<div class="flex items-center text-left">
						<img class="w-[20px] sm:w-[40px] mr-[10px]" src="images/wind.png" alt="wind icon" />
						<div>
							<p class="text-[13px] sm:text-[28px]">{weatherData.wind.speed} km/h</p>
							<p class="text-[13px] sm:text-[28px] capitalize">Wind Speed</p>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<p class="capitalize mt-5 text-center z-50">Enter a city name to get the weather.</p>
		{/if}
	</div>
</main>

<style>
	#background {
		position: relative;
	}

	.background-image {
		position: absolute;
		background-size: cover;
		background-position: center;
		animation: moveFromLeftToRight linear infinite;
	}

	@keyframes moveFromLeftToRight {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
