<script lang="ts">
	import CustomInput from '$lib/components/CustomInput.svelte';
	import { KeyIcon, UserIcon, EnvelopeIcon } from 'heroicons-svelte/24/solid';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { ensureApolloLoaded } from '$lib/utils/ensureApolloClient';
	import { apolloStore } from '$lib/stores/chartStore';
	import toast from 'svelte-french-toast';
	import { mutation } from 'svelte-apollo-wrappers';
	import gql from 'graphql-tag';
	import { signIn } from '@auth/sveltekit/client';
	import { goto } from '$app/navigation';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let hasClient: boolean = $state(false);

	$effect.pre(() => {
		hasClient = ensureApolloLoaded($apolloStore);
	});
	const registerSubscriber = mutation(gql(data.REGISTER));
</script>

<svelte:head>
	<title>Prometheus Registration</title>
</svelte:head>
<div class="flex flex-col gap-4 items-center justify-center h-full">
	<div class="flex flex-col">
		<h1
			class="[font-size:50px] lg:[font-size:85px] lg:[line-height:115px] font-[desmodus] bg-clip-text bg-gradient-to-t text-transparent from-lime-200 to-lime-600 from-10% text-center tracking-widest"
		>
			Prometheus
		</h1>
		<p class="max-md:hidden text-center text-white tracking-widest text-xl">
			Taking your power back from the gatekeeping gods
		</p>
	</div>
	<form
		use:enhance={async () => {
			return async ({ result, update, formData }: { result: any; update: any; formData: any }) => {
				if (result.data.hasErrors) {
					toast.error(result.data.msg);
					update();
				} else {
					const { data } = (await registerSubscriber({
						variables: { registration: result.data.registration }
					})) as any;
					if (data.error) {
						toast.error(data.error);
					} else {
						const credentials = {
							username: formData.get('userName'),
							password: formData.get('password')
						};
						const result: any = await signIn('credentials', { ...credentials, redirect: false });
						if (result?.ok) {
							// Redirect after successful login
							goto('/home');
						} else {
							// Handle login error
							console.error('Login failed', result?.error);
						}
					}
				}
			};
		}}
		action="?/register"
		method="post"
		class="flex flex-col gap-1 items-center justify-center mt-20"
	>
		<div class="flex flex-col gap-4">
			<CustomInput
				hasError={form?.errors.username || false}
				inputOptions={{
					type: 'text',
					placeholder: 'Username',
					name: 'userName',
					value: form?.registration?.username ?? null
				}}
			>
				{#snippet beforeEl()}
					<UserIcon class="w-6 text-slate-500"></UserIcon>
				{/snippet}
			</CustomInput>
			<CustomInput
				hasError={form?.errors.email || false}
				inputOptions={{
					type: 'text',
					placeholder: 'Email',
					name: 'email',
					value: form?.registration?.email ?? null
				}}
			>
				{#snippet beforeEl()}
					<EnvelopeIcon class="w-6 text-slate-500"></EnvelopeIcon>
				{/snippet}
			</CustomInput>
			<CustomInput
				hasError={form?.errors.password || false}
				inputOptions={{
					type: 'password',
					placeholder: 'Password',
					name: 'password',
					value: form?.registration?.password ?? null
				}}
			>
				{#snippet beforeEl()}
					<KeyIcon class="w-6 text-slate-500" />
				{/snippet}
			</CustomInput>
			<CustomInput
				hasError={form?.errors.confirmPassword || false}
				inputOptions={{
					type: 'password',
					placeholder: 'Confirm Password',
					name: 'confirmPassword',
					value: form?.registration?.confirmPassword ?? null
				}}
			>
				{#snippet beforeEl()}
					<KeyIcon class="w-6 text-slate-500"></KeyIcon>
				{/snippet}
			</CustomInput>
		</div>
		{#if form && form.hasErrors && form?.msg}
			<div class="text-white text-lg">{form.msg}</div>
		{/if}
		<button
			type="submit"
			class="text-2xl border-4 w-60 rounded-full mt-10 text-white font-extrabold shadow-md shadow-black pb-2 tracking-widest transition-all duration-500 hover:shadow-none"
			>Join</button
		>
	</form>
	<p class="text-white text-xl [text-shadow:_black_2px_0_10px] tracking-wide">
		Already have an account? <a href="/" class="font-semibold">Login</a>
	</p>
</div>
