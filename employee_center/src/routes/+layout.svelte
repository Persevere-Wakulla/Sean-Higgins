<script>
  import { isImpersonating } from "$lib/stores/layout";
import "./styles.css";
</script>

<div
  class="app bg-[url('/login_bg.jpg')] min-h-svh flex flex-col bg-cover max-sm:bg-center max-sm:overflow-hidden"
>
  <main class=" backdrop-blur-sm  flex flex-col flex-1 box-border dark:bg-gradient-to-tr bg-gradient-to-br from-slate-100 from-60% dark:from-slate-600 dark:to-lime-200 dark:from-30%">
      <slot />
  </main>
</div>
