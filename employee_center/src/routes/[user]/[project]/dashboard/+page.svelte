<script lang="ts">
  import DashboardCard from "$lib/components/DashboardCard.svelte";
  import type { PageData } from "./$types";
  import dayjs from "dayjs";
  import { DatePicker } from "date-picker-svelte";
  import { Timesheet } from "$lib/classes/timesheet";
  import { defaultDay, project, user, type Day } from "$lib/stores/layout";
  import { post } from "$lib/database/server";
  import { goto } from "$app/navigation";
  import TimesheetPreview from "$lib/components/TimesheetPreview.svelte";
  import ReviewPreview from "$lib/components/ReviewPreview.svelte";
  import ChargeCodePreview from "$lib/components/ChargeCodePreview.svelte";
  import HealthOverview from "$lib/components/HealthOverview.svelte";

  export let data: PageData;

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
      `/${$user.id}/${$project?.projectId}/timesheet/${response.data.timesheetId}`
    );
  };
</script>

<!-- svelte-ignore non-top-level-reactive-declaration -->
<svelte:head>
  <title>Ticker Time</title>
  <meta name="description" content="Ticker Time" />
</svelte:head>
<div class="flex gap-4 flex-wrap w-fit mx-auto">
  <DashboardCard header="Timesheet Creation">
    <div class="flex flex-col gap-4">
      <DatePicker
        on:select={(e) => {
          handleCreate(e.detail);
        }}
        max={dayjs().add(10, "days").endOf("week").toDate()}
        min={dayjs().subtract(5, "month").toDate()}
      />

      <h5 class="text-center text-sm dark:text-white">
        Select day to create weekly timesheet
      </h5>
    </div>
    <div class="flex"></div>
  </DashboardCard>
  <DashboardCard header="Newest Timesheets">
    <TimesheetPreview timesheets={data.timesheets} />
  </DashboardCard>
  {#if $user.role === "admin"}
    <DashboardCard header="Timesheets to Review">
      <ReviewPreview timesheets={data.toReview} />
    </DashboardCard>
    <DashboardCard header="Charge Codes">
      <ChargeCodePreview chargeCodes={data.chargeCodes} />
    </DashboardCard>
  {/if}

  <DashboardCard header="Benefits Overview">
    {#if $user.isEnrolledHealth}
      <HealthOverview employee={$user} />
    {:else}
      <h4 class="dark:text-white">Not currently enrolled in Health plan</h4>
    {/if}
  </DashboardCard>
</div>

<style>
</style>
