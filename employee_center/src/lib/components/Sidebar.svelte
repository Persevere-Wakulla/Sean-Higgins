<script lang="ts">
  import { page } from "$app/stores";
  import {
    isImpersonating,
    project,
    sideBarIsOpen,
    user,
  } from "$lib/stores/layout";
  import ProjectSelector from "./ProjectSelector.svelte";

  let openButton: HTMLElement;
  let sideBar: HTMLElement;
  const clickOutside = (element: HTMLElement, cb: Function) => {
    function onClick(event: Event) {
      if (
        !element.contains(event.target) &&
        event.target !== openButton &&
        !openButton.contains(event.target)
      ) {
        cb();
      }
    }
    document.body.addEventListener("click", onClick);

    return {
      update(newCb: Function) {
        cb = newCb;
      },
      destroy() {
        document.body.removeEventListener("click", onClick);
      },
    };
  };
</script>

<aside
  use:clickOutside={() => {
    sideBarIsOpen.set(false);
  }}
  bind:this={sideBar}
  class={` z-50 bg-gradient-to-bl dark:from-slate-900 dark:to-zinc-700 shadow-md up  shadow-black tracking-widest select-none transition-all duration-500 max-sm:text-[70%] ${$sideBarIsOpen ? " translate-x-[0]" : " -translate-x-full"} max-h-svh overflow-auto`}
>
  <nav>
    <div class="flex flex-col items-center">
      <img class=" w-12 m-4 max-sm:m-0" src={$user?.image} alt="" />
      <h6 class="text-xs dark:text-slate-300 text-black">Welcome</h6>
      <h4 class=" font-bold dark:text-fuchsia-500 text-fuchsia-800 text-xl font-[bell] mt-2">
        {$user.firstName}
        {$user.lastName}
      </h4>
      <ProjectSelector isAdmin={$user.role === "admin"}></ProjectSelector>
    </div>
    <ul class="flex flex-col gap-4 mt-2 text-lg">
      <li
        class:page={$page.url.pathname.includes("dashboard")}
        aria-current={$page.url.pathname.includes("dashboard")
          ? "page"
          : undefined}
      >
        <a
          class={` duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.includes("dashboard") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
          on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
          href={`/${$user.id}/${$project?.projectId}/dashboard`}
          class:active={$page.url.pathname.includes("dashboard")}>Dashboard</a
        >
      </li>
      {#if $user.role === "admin" || $isImpersonating}
        <li>
          <a
            on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
            href={`/${$user.id}/project`}
            class={` duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.includes("project") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
            >Create Project</a
          >
        </li>
      {/if}
      <li>
        <div>
          <a
            on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
            href={`/${$user.id}/${$project?.projectId}/timesheet`}
            class={`duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.includes("timesheet") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
            >Timesheet</a
          >
          {#if $user.role !== "user"}
            <ul class="pl-8 flex flex-col gap-4 mt-4">
              <li
                class="flex gap-4 items-center dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-slate-300 transition-all duration-500"
              >
                <i class="bi bi-calendar-check"></i>
                <a
                  on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
                  href={`/${$user.id}/${$project?.projectId}/timesheet/review`}
                  class={`duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.includes("review") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
                  >Review</a
                >
              </li>
            </ul>
          {/if}
        </div>
      </li>
      <li
        class="  dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-slate-300 transition-all duration-500"
        aria-current={$page.url.pathname.includes("/benefits")
          ? "page"
          : undefined}
      >
        <div>
          <a
            class={`duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.endsWith("benefits") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
            on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
            href={`/${$user.id}/benefits`}>Benefits</a
          >
          <ul class="pl-8 flex flex-col gap-4 mt-4">
            <li
              class="flex gap-4 items-center dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-slate-300 transition-all duration-500"
            >
              <i class="bi bi-file-medical"></i>
              <a
                on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
                href={`/${$user.id}/benefits/health`}
                class={`duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.includes("health") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
                class:active={$page.url.pathname === "/benefits/health"}
                >Health</a
              >
            </li>
            <li
              class="flex gap-4 items-center dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-slate-300 transition-all duration-500"
            >
              <i class="bi bi-piggy-bank"></i>
              <a
                on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
                href={`/${$user.id}/benefits/deposit`}
                class={`duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.includes("deposit") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
                class:active={$page.url.pathname === "/benefits/deposit"}
                >Deposit</a
              >
            </li>
            <!-- <li
              class="flex gap-4 items-center dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-slate-300 transition-all duration-500"
            >
              <i class="bi bi-currency-bitcoin"></i>
              <a
                on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
                href={`/${$user.id}/benefits/crypto`}
                class={`duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.includes("crypto") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
                class:active={$page.url.pathname === "/benefits/crypto"}
                >Crypto</a
              >
            </li> -->
          </ul>
        </div>
      </li>
      {#if $user.role === "admin" || $user.role === "moderator" || $isImpersonating}
        <li
          aria-current={$page.url.pathname.includes("/") ? "page" : undefined}
        >
          <a
            class={`duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.includes("chargeCodes") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
            on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
            href={`/${$user.id}/${$project?.projectId}/chargeCodes`}
            >Charge Codes</a
          >
        </li>
        <li
          aria-current={$page.url.pathname.includes("/") ? "page" : undefined}
        >
          <a
            class={`duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.includes("budget") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
            on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
            href={`/${$user.id}/${$project?.projectId}/budget`}>Budget</a
          >
        </li>
      {/if}
      {#if $user.role === "admin" || $isImpersonating}
        <li
          aria-current={$page.url.pathname.includes("/") ? "page" : undefined}
        >
          <a
            class={`duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 text-nowrap ${$page.url.pathname.endsWith("userSetup") ? " dark:text-fuchsia-500 text-fuchsia-800" : "dark:text-slate-300 text-black"}`}
            on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
            href={`/${$user.id}/${$project?.projectId}/userSetup`}
            >Setup Users</a
          >
        </li>
      {/if}
      <li aria-current={$page.url.pathname.includes("/") ? "page" : undefined}>
        <a
          class="duration-500 transition-all dark:hover:text-fuchsia-500 hover:text-fuchsia-700 dark:text-slate-300 text-black"
          on:click={() => sideBarIsOpen.set(false)}
          href="/">Logout</a
        >
      </li>
    </ul>
  </nav>
</aside>
<button
  bind:this={openButton}
  on:click={() => sideBarIsOpen.set(!$sideBarIsOpen)}
  class={` dark:bg-slate-900 fixed z-10 h-10 cursor-pointer hover:scale-x-150 top-0 left-0 px-2 transition-all duration-500 ${$sideBarIsOpen ? `translate-x-[${sideBar.clientWidth}px]` : ""}`}
  >
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    class="fill-fuchsia-500"
    viewBox="0 0 16 16"
  >
    <path
      d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z"
    />
  </svg></button
>

<style>
  aside {
    position: fixed;
    width: 60%;
    max-width: var(--sidebar-max-width);
    padding: 2rem;
    top: 0;
    bottom: 0;
    height: 100%;
    /* transform: translateX(-100%); */
    /* box-shadow: 0 2px 20px hsl(0, 0%, 4%); */
    /* background-color: var(--sidebar-bg); */
    z-index: 1;
  }
</style>
