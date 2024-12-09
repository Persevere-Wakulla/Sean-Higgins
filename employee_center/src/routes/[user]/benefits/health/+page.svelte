<script lang="ts">
  import type { PageData } from "./$types";
  import { fade } from "svelte/transition";
  import { user, type User } from "$lib/stores/layout";
  import { enhance } from "$app/forms";

  export let data: PageData;
  $: currentIndex = 0;
  const calculateMonthlyHealth = (employee: User) => {
    let spousalCost = employee.health.spouseIncludedHealth
      ? employee.health.medicalPlan.spouseCost
      : 0;

    return (
      employee.health.medicalPlan.monthlyCost +
      spousalCost +
      employee.health.dependents * employee.health.medicalPlan.dependentsCost
    );
  };
</script>

{#if data.isEnrolled}
  <h4 class="text-3xl text-fuchsia-500 text-center">Current Medical Package</h4>
  <div class="flex flex-col items-center gap-2">
    <h4 class="text-2xl">{$user.health.medicalPlan.name}</h4>
    <div class="flex">
      <h4 class="text-2xl">
        Total Monthly: <span class="text-red-400"
          >${calculateMonthlyHealth($user)}</span
        >
      </h4>
    </div>
    <h4 class="text-2xl">
      Spouse Covered: {$user.health.spouseIncludedHealth ? "Yes" : "No"}
    </h4>
    {#if $user.health.dependents > 0}
      <h4 class="text-2xl">Dependents: {$user.health.dependents}</h4>
    {/if}
    {#if $user.health.medicalPlan.hasDeductible}
         <h4 class="text-2xl">Deductible: ${$user.health.medicalPlan.deductibleAmount}</h4>
    {/if}
    <div class="flex gap-4 text-wrap">
      <h4 class="text-2xl">
        PCP: ${$user.health.medicalPlan.copayments.primaryCare}
      </h4>
      <h4 class="text-2xl">
        Specialist: ${$user.health.medicalPlan.copayments.specialist}
      </h4>
      <h4 class="text-2xl">
        Outside Network: ${$user.health.medicalPlan.copayments.outOfNetwork}
      </h4>
    </div>
    <div class="flex flex-col gap-2 items-center">
        <p class="text-xl text-center text-wrap w-1/2 max-md:w-full">Overview: {$user.health.medicalPlan.descr}</p>
        <p class="text-xl text-wrap w-1/2 max-md:w-full">Details: {$user.health.medicalPlan.benefitsDetails}</p>
    </div>
  </div>
{:else}
  <h4 class="text-2xl mb-4">Chose Enrollment</h4>
  <div class="flex justify-evenly max-md:flex-col max-md:items-center">
    {#each data.plans as { name }, i (name)}
      <div class="flex items-center gap-4">
        <button
          on:click={() => (currentIndex = i)}
          class:text-fuchsia-500={currentIndex === i}
          class:font-[bell]={currentIndex === i}
          class="text-3xl tracking-widest hover:text-fuchsia-500 duration-500 transition-all"
          >{name}</button
        >
      </div>
    {:else}
      <h4>No Plans Found</h4>
    {/each}
  </div>
  <div class="flex flex-col items-center w-full mt-10">
    {#each data.plans as plan, i}
      {#key i}
        {#if currentIndex === i}
          <form
            action="?/enroll"
            method="post"
            use:enhance={() => {
              return () => {};
            }}
          >
            <input type="hidden" name="id" value={$user.id} />
            <input type="hidden" name="medicalId" value={plan.medicalId} />
            <div
              class="flex flex-col gap-4 items-center"
              in:fade={{ duration: 1000 }}
            >
              <div class="flex gap-6 max-md:gap-2 max-md:flex-col">
                <h4
                  class="text-2xl tracking-wider max-md:text-lg max-md:text-center"
                >
                  Individual: <span class="text-lime-400"
                    >${plan.monthlyCost}</span
                  >
                </h4>
                <h4
                  class="text-2xl tracking-wider max-md:text-lg max-md:text-center"
                >
                  Spouse: <span class="text-lime-400">${plan.spouseCost}</span>
                </h4>
                <h4
                  class="text-2xl tracking-wider max-md:text-lg max-md:text-center"
                >
                  Dependent: <span class="text-lime-400"
                    >${plan.dependentsCost}</span
                  >
                </h4>
              </div>
              <p class="text-wrap text-center w-1/2 text-lg">{plan.descr}</p>
              <p class="text-wrap text-center w-1/2 text-xl">
                {plan.benefitsDetails}
              </p>
              {#if plan.hasDeductable}
                <div class="flex flex-col text-center">
                  <h4 class="text-xl">Copays apply after deductible is met</h4>
                  <h4 class="text-xl">
                    Deductible Amount: <span class="text-lime-400"
                      >${plan.deductibleAmount}</span
                    >
                  </h4>
                </div>
              {/if}
              <h4 class="text-xl">Copayments:</h4>
              <div class="flex gap-4">
                <span class="text-xl"
                  >PCP: <span class="text-lime-400"
                    >${plan.copayments.primaryCare}</span
                  ></span
                >
                <span class="text-xl"
                  >Specialist: <span class="text-lime-400"
                    >${plan.copayments.specialist}</span
                  ></span
                >
                <span class="text-xl"
                  >Out Of Network: <span class="text-lime-400"
                    >${plan.copayments.outOfNetwork}</span
                  ></span
                >
              </div>
              <div class="flex flex-col gap-4">
                <label for="spouse" class="flex gap-4 text-xl"
                  >Include Spouse:
                  <input
                    type="checkbox"
                    name="coverSpouse"
                    class="hover:cursor-pointer"
                    id="spouse"
                  />
                </label>
                <label for="dependents" class="flex gap-4 text-xl items-center"
                  >Dependents:
                  <select
                    class="bg-slate-700 p-2"
                    name="dependents"
                    id="dependents"
                  >
                    <option class="bg-slate-700" value="0">0 dependents</option>
                    <option class="bg-slate-700" value="1">1 dependent</option>
                    <option class="bg-slate-700" value="2">2 dependents</option>
                    <option class="bg-slate-700" value="3">3 dependents</option>
                    <option class="bg-slate-700" value="4">4 dependents</option>
                    <option class="bg-slate-700" value="5">5 dependents</option>
                  </select>
                </label>
              </div>
              <button
                class="bg-lime-500 px-8 text-lg shadow-md shadow-black"
                type="submit">Enroll</button
              >
            </div>
          </form>
        {/if}
      {/key}
    {:else}
      <h4>No Plans Found</h4>
    {/each}
  </div>
{/if}
