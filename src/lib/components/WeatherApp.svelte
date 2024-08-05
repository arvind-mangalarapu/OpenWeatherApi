<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import WeatherApi from './WeatherApi.svelte';

	let city = '';
	let weatherData = null;
	let error = null;
	let fetchWeather = false;

	// GSAP

	onMount(() => {
		const tl = gsap.timeline({
			repeat: -1,
			yoyo: true
		});

		tl.to('#background', {
			backgroundPosition: '400% 400%',
			duration: 1,
			ease: 'none'
		}).to('#background', {
			backgroundImage: 'linear-gradient(135deg, #00feba, #97ea7b ,#00fsba)',
			duration: 10,
			ease: 'none'
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
				return 'images/clouds.png'; // Fallback image
		}
	}
</script>

<main class="h-[100vh] w-[100vw] bg-black text-black pt-[20%]" id="main">
	<div
		id="background"
		class="w-[90%] max-w-[470px] bg-gradient-to-tr from-[#00feba] to-[#97ea7b] mx-auto text-[#000] rounded-[20px] py-[40px] px-[35px] text-center"
	>
		<div class="w-full flex justify-evenly sm:justify-between items-center">
			<input
				bind:value={city}
				class="border-none outline-none bg-[#ebfffc] text-[#000] py-[5px] px-[15px] sm:py-[10px] sm:px-[25px] h-[30px] sm:h-[60px] rounded-[30px] sm:flex-1 mr-[16px] text-[12px] sm:text-[18px]"
				placeholder="Enter city name"
				spellcheck="false"
				on:keydown={handleKeyDown}
			/>
			<button
				class="border-none outline-none bg-[#ebfffc] rounded-[50%] w-[30px] h-[30px] sm:w-[60px] sm:h-[60px] cursor-pointer flex justify-center items-center"
				on:click={searchWeather}
			>
				<img class="w-[16px]" src="images/search.png" alt="search" />
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
				<h1 class="text-[80px] capitalize">{weatherData.main.temp}°C</h1>
				<h2 class="text-[45px] capitalize">{weatherData.name}</h2>
				<div class="w-[100%] flex items-center justify-evenly sm:justify-between mt-[50px]">
					<div class="flex items-center text-left">
						<img class="w-[20px] sm:w-[40px] mr-[10px]" src="images/humidity.png" alt="humidity" />
						<div>
							<p class="text-[13px] sm:text-[28px]">{weatherData.main.humidity}%</p>
							<p class="text-[13px] sm:text-[28px] capitalize">Humidity</p>
						</div>
					</div>
					<div class="flex items-center text-left">
						<img class="w-[20px] sm:w-[40px] mr-[10px]" src="images/wind.png" alt="wind" />
						<div>
							<p class="text-[13px] sm:text-[28px]">{weatherData.wind.speed} km/h</p>
							<p class="text-[13px] sm:text-[28px] capitalize">Wind Speed</p>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<p class="capitalize mt-5 text-center">Enter a city name to get the weather.</p>
		{/if}
	</div>
</main>
