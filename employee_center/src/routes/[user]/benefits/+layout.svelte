<script>
  import { page } from "$app/stores";
  import GenericLayoutCard from "$lib/components/GenericLayoutCard.svelte";
  import { user } from "$lib/stores/layout";
</script>


<GenericLayoutCard pageHeader="Benefits">
  <div slot="navigation">
    <ul class="flex flex-col gap-4 max-sm:flex-row max-sm:flex-wrap">
      <li class="flex gap-4 transition-all duration-500 hover:text-fuchsia-500"
          class:text-fuchsia-500={$page.url.pathname.endsWith("benefits")}>
        <i class="bi bi-view-list text-2xl"></i>
        <a
          href={`/${$user.id}/benefits`}
          class="text-nowrap text-xl"
          >Overview</a
        >
      </li>
      <li class="flex gap-4 transition-all duration-500 hover:text-fuchsia-500"
          class:text-fuchsia-500={$page.url.pathname.endsWith("health")}>
        <i class="bi bi-journal-medical text-2xl"></i>
        <a
          href={`/${$user.id}/benefits/health`}
          class="text-nowrap text-xl"
          >Health</a
        >
      </li>
      <li class="flex gap-4 duration-500 hover:text-fuchsia-500"
          class:text-fuchsia-500={$page.url.pathname.endsWith("deposit")}>
        <i class="bi bi-piggy-bank text-2xl"></i>
        <a
          href={`/${$user.id}/benefits/deposit`}
          class="text-nowrap text-xl"
          >Deposit</a
        >
      </li>
      <!-- <li class="flex gap-4 duration-500 hover:text-fuchsia-500"
          class:text-fuchsia-500={$page.url.pathname.endsWith("crypto")}>
        <i class="bi bi-currency-bitcoin text-2xl"></i>
        <a
          href={`/${$user.id}/benefits/crypto`}
          class="text-nowrap text-xl"
          >Crypto</a
        >
      </li> -->
    </ul>
  </div>
  <div slot="main" class=" h-[600px] max-sm:h-full">
    <slot></slot>
  </div>
</GenericLayoutCard>