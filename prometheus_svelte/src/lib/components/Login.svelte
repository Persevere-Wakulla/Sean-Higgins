<script lang="ts">
	import type { InputOptions } from '$lib/types/inputOptions';
	import CustomInput from './CustomInput.svelte';
	import { KeyIcon, EyeIcon, UserIcon } from 'heroicons-svelte/24/solid';
	import { goto } from '$app/navigation';
	import { signIn } from '@auth/sveltekit/client';
	let loginCredentials = $state({ username: null, password: null, remember: false });
	let formEl: HTMLFormElement;
	let passwordInputOptions = $state({
		type: 'password',
		name: 'password',
		value: loginCredentials.password,
		placeholder: 'Password'
	} as InputOptions);
	async function handleSubmit(event: Event) {
		event.preventDefault();
		const form = new FormData(formEl as HTMLFormElement);
		const credentials = {
			username: form.get('username'),
			password: form.get('password'),
		}
		const result: any = await signIn('credentials', { ...credentials, redirect: false });

		if (result?.ok) {
			// Redirect after successful login
			goto('/home');
		} else {
			// Handle login error
			console.error('Login failed', result?.error);
		}
	}
</script>

<svelte:window onkeydown={(e) => {
	if(e.key === 'Enter') handleSubmit(e)}}></svelte:window>

<section
	class="md:grid md:grid-cols-12 md:grid-rows-4 flex max-md:flex-col justify-between h-screen max-md:max-w-[600px] max-sm:items-center max-md:m-auto"
>
	<div
		class="col-start-1 col-end-13 bg-cover bg-center bg-no-repeat bg-[url('/header.jpg')] row-start-1 row-end-5"
	></div>
	<div class="row-start-1 flex flex-col md:col-start-1 md:col-end-6">
		<h1
			class="[font-size:50px] lg:[font-size:85px] lg:[line-height:115px] font-[desmodus] bg-clip-text bg-gradient-to-br text-transparent from-lime-200 to-lime-600 from-40% text-center tracking-widest"
		>
			Prometheus
		</h1>
		<p class="max-md:hidden text-center text-white tracking-widest text-xl">
			Take your power back from the gatekeeping gods
		</p>
	</div>
	<div class="flex flex-col gap-6 p-4 md:p-0 md:col-start-9 md:row-start-2 md:col-end-11">
		<form
			bind:this={formEl}
			class="flex flex-col gap-6 p-4 md:p-0 md:col-start-9 md:row-start-2 md:col-end-11"
			onsubmit={handleSubmit}
		>
				<CustomInput
					inputOptions={{
						type: 'text',
						placeholder: 'Username',
						name: 'username',
						value: null
					}}
				>
					{#snippet beforeEl()}
						<UserIcon class="w-6 text-gray-400"></UserIcon>
					{/snippet}
				</CustomInput>
				<CustomInput inputOptions={passwordInputOptions}>
					{#snippet beforeEl()}
						<KeyIcon class="w-6 text-gray-400"></KeyIcon>
					{/snippet}
					{#snippet afterEl()}
						<button
							onclick={(e: Event) => {
								e.preventDefault();
								passwordInputOptions.type =
									passwordInputOptions.type === 'text' ? 'password' : 'text';
							}}
						>
							<EyeIcon
								class={`w-6 z-10  hover:cursor-pointer ${passwordInputOptions.type === 'text' ? 'text-gray-600' : 'text-gray-400'}`}
							></EyeIcon>
						</button>
					{/snippet}
				</CustomInput>
				<div class="flex gap-4 self-end">
					<h4 class="text-lg text-white">Remember Me</h4>
					<div class="self-end">
						<div class="shadow-md rounded-full shadow-gray-900 bg-transparent">
							<div
								class="flex w-8 items-center hover:cursor-pointer shadow-inner shadow-gray-600 bg-white rounded-full"
							>
								<input type="hidden" name="remember" bind:value={loginCredentials.remember} />
								<button
									aria-label="remember"
									onclick={(e: Event) => {
										e.preventDefault();
										loginCredentials.remember = !loginCredentials.remember;
									}}
									class={`text-sm bg-gradient-conic from-gray-500 to-gray-300 from-30% duration-500 transition-all border-2 px-2 py-1 ${loginCredentials.remember ? 'translate-x-3 from-lime-400 to-lime-600 border-lime-700' : 'translate-x-0'} border-gray-600 rounded-full h-5`}
								></button>
							</div>
						</div>
					</div>
				</div>
				<button
					type="submit"
					class="bg-lime-400 select-none py-1 rounded-full shadow-md shadow-gray-800 hover:cursor-pointer hover:bg-lime-600 hover:shadow-none duration-500 transition-all font-semibold tracking-wider"
				>
					Login
				</button>
		</form>
		<div class="flex flex-col gap-1 items-center">
			<a href="/forgot"
				><p class="cursor-pointer text-lg font-extrabold text-white">Forgot password</p></a
			>
			<p class="text-lg text-white">
				Don't have an account? <a href="/registration"
					><span class="cursor-pointer font-extrabold">Sign Up</span></a
				>
			</p>
		</div>
	</div>
	<div class="md:hidden"></div>
</section>
