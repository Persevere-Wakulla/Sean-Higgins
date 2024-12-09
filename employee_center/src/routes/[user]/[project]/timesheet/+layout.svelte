<script lang="ts">
  import dayjs from "dayjs";
  import { DateInput, DatePicker } from "date-picker-svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import GenericLayoutCard from "$lib/components/GenericLayoutCard.svelte";
  import { user, defaultDay, type Day, project } from "$lib/stores/layout";
  import { Timesheet } from "$lib/classes/timesheet";
  import { post } from "$lib/database/server";
  import { goto } from "$app/navigation";
  import { blur } from "svelte/transition";

  let innerWidth = 0;
  onMount(() => {
    innerWidth = window.innerWidth;
  });

  const handleCreate = async (date: Date) => {
    let beginningOfWeek = dayjs(date).startOf("week");
    let timesheet = new Timesheet(
      $user.id,
      `${(beginningOfWeek.month() + 1).toString().padStart(2, "0")}/${beginningOfWeek.date().toString().padStart(2, "0")}/${beginningOfWeek.year()}`
    );

    let days = [];
    for (let i = 1; i <= 7; i++) {
      days.push({
        ...defaultDay,
        date: `${(beginningOfWeek.month() + 1).toString().padStart(2, "0")}/${beginningOfWeek.date().toString().padStart(2, "0")}/${beginningOfWeek.year()}`,
      } as Day);
      beginningOfWeek = beginningOfWeek.add(1, "day");
    }
    timesheet.updateDays(days);
    const response = await post("timesheet", timesheet.toJson());

    goto(
      `/${$user.id}/${$user.projectId}/timesheet/${response.data.timesheetId}`
    );
  };
</script>

<svelte:window bind:innerWidth />

<GenericLayoutCard pageHeader="Timesheet Management">
  <svelte:fragment slot="navigation">
    <div class="flex flex-col gap-4">
      <div
        class="flex gap-4 items-center dark:text-white hover:text-fuchsia-400 transition-all duration-500 hover:cursor-pointer"
      >
        <a
          href={`/${$user.id}/${$project?.projectId}/timesheet`}
          class={`${$page.url.pathname.endsWith("timesheet") ? " text-fuchsia-400" : ""} flex gap-4 items-center`}
        >
          <i class="bi bi-calendar3 text-xl"></i>
          <h5 class="text-xl">Existing</h5>
        </a>
      </div>

      {#if $user.role !== "user"}
        <div
          class="flex gap-4 items-center dark:text-white hover:text-fuchsia-400 transition-all duration-500 hover:cursor-pointer"
        >
          <a
            href={`/${$user.id}/${$project?.projectId}/timesheet/review`}
            class={`${$page.url.pathname.endsWith("review") ? " text-fuchsia-400" : ""} flex gap-4 items-center`}
          >
            <i class="bi bi-calendar-check text-xl"></i>
            <h5 class="text-xl">Review</h5>
          </a>
        </div>
      {/if}
    </div>

    <div
      class="flex flex-col flex-wrap gap-2 dark:text-white hover:text-fuchsia-400 transition-all duration-500 hover:cursor-pointer"
    >
      {#if innerWidth > 639}
        <DatePicker
          on:select={(e) => {
            handleCreate(e.detail);
          }}
          max={dayjs().add(10, "days").endOf("week").toDate()}
          min={dayjs().subtract(5, "month").toDate()}
        />

        <h5 class="text-center text-sm">Select day to Create</h5>
      {:else if innerWidth <= 639}
        <DateInput
          class="z-20"
          closeOnSelection
          format="MM/dd/yy"
          disabled={$page.url.pathname.endsWith("create")}
          placeholder="Select day"
          on:select={(e) => {
            handleCreate(e.detail);
          }}
          max={dayjs().add(10, "days").endOf("week").toDate()}
          min={dayjs().subtract(5, "month").toDate()}
        />
      {:else}
        <a
          class="flex gap-4 items-center"
          href={`/${$user.id}/${$project?.projectId}/timesheet`}
        >
          <i class="bi bi-calendar text-2xl"></i>
          <h3>Create</h3>
        </a>
      {/if}
    </div>
  </svelte:fragment>
  <div slot="main" class=" h-[600px] max-sm:h-full">
    <slot></slot>
  </div>
</GenericLayoutCard>
