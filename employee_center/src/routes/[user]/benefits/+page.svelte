<script lang="ts">
  import { goto } from "$app/navigation";
  import HealthOverview from "$lib/components/HealthOverview.svelte";
  import { user, type User } from "$lib/stores/layout";
  import type { PageData } from "../$types";

  export let data: PageData;

  const calculateMonthlyHealth = (employee: User) => {
    let spousalCost = employee.health.spouseIncludedHealth ? employee.health.medicalPlan.spouseCost : 0;

    return employee.health.medicalPlan.monthlyCost + spousalCost + (employee.health.dependents * employee.health.medicalPlan.dependentsCost);
  }

</script>

<svelte:head>
  <title>Benefits</title>
  <meta name="description" content="Ticker Time" />
</svelte:head>

<div class="flex gap-4 max-sm:flex-col max-md:flex-col">
  <div
    class="flex flex-col border border-lime-300 p-4 border-opacity-20 shadow-inner shadow-black rounded w-1/3 max-lg:w-full"
  >
    <h4 class="text-3xl text-fuchsia-500 font-[bell]">Money</h4>
    <div class="flex flex-col mt-4 ml-4 max-md:flex-row max-md:justify-between">
        <h5 class="text-2xl">Net Gross: <span class="text-lime-400">${data.netYtd.toFixed(2)}</span></h5>
        <h5 class="text-2xl">Ytd Gross: <span class="text-lime-400">${data.grossYtd.toFixed(2)}</span></h5>
    </div>
  </div>
  <!-- <div
    class="flex flex-col border border-lime-300 p-4 border-opacity-20 shadow-inner shadow-black rounded w-1/3 max-lg:w-full"
  >
    <h4 class="text-3xl text-fuchsia-500 font-[bell]">Crypto</h4>
    <div class="ml-4">
      {#if $user.isEnrolledCrypto}
        <h5 class="text-lg">
          Net Crypto Gross: ${data.cryptoNetYtd.toFixed(2)}
        </h5>
        <h5 class="text-lg">
          Ytd Crypto Gross: ${data.cryptoGrossYtd.toFixed(2)}
        </h5>
      {:else}
        <div class="flex flex-col justify-center mt-4 gap-4">
          <p class="text-lg text-wrap">
            Not currently enrolled in a crypto payment percentage. Get <span
              class="text-fuchsia-500"
            >
              <i class="bi bi-currency-bitcoin"></i> Bitcoin or Etheruem</span
            > instead of cash
          </p>
          <button
            on:click={() => goto(`/${$user.id}/benefits/crypto`)}
            class="bg-lime-500 text-xl rounded shadow-sm shadow-black hover:bg-lime-700 hover:shadow-none transition-all duration-500"
            >Setup</button
          >
        </div>
      {/if}
    </div>
  </div> -->
  <div
    class="flex flex-col border border-lime-300 p-4 border-opacity-20 shadow-inner shadow-black rounded w-1/3 max-lg:w-full"
  >
    <h4 class="text-3xl text-fuchsia-500 font-[bell]">Health</h4>
    <div class="ml-4">
      {#if $user.isEnrolledHealth}
        <HealthOverview employee={$user} />
      {:else}
        <div class="flex flex-col justify-center mt-4 gap-4">
          <p class="text-lg text-wrap">
            Not currently enrolled in a health plan. Join open enrollment <span
              class="uppercase tracking-wider text-fuchsia-500">today</span
            >, year-round
          </p>
          <button
            on:click={() => goto(`/${$user.id}/benefits/health`)}
            class="bg-lime-500 text-xl rounded shadow-sm shadow-black hover:bg-lime-700 hover:shadow-none transition-all duration-500"
            >Enroll</button
          >
        </div>
      {/if}
    </div>
  </div>
</div>
