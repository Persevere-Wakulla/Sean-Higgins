<script lang="ts">
  import {
    currentTimesheet,
    projectChargeCodes,
    type Day,
  } from "$lib/stores/layout";
  import { onMount } from "svelte";
  import { post } from "$lib/database/server";
  import { page } from "$app/stores";
  import toast from "svelte-french-toast";
  import dayjs from "dayjs";
  import { blur } from "svelte/transition";

  export let isReview;

  const generateDay = () => {
    return {
      id: crypto.randomUUID(),
      date: "",
      start: "",
      end: "",
      break: "",
      chargeCode: "",
      note: "",
      total: 0,
    } satisfies Day;
  };

  const defaultHours = [
    { time: "12AM", value: 0 },
    { time: "12:30AM", value: 0.5 },
    { time: "1AM", value: 1 },
    { time: "1:30AM", value: 1.5 },
    { time: "2AM", value: 2 },
    { time: "2:30AM", value: 2.5 },
    { time: "3AM", value: 3 },
    { time: "3:30AM", value: 3.5 },
    { time: "4AM", value: 4 },
    { time: "4:30AM", value: 4.5 },
    { time: "5AM", value: 5 },
    { time: "5:30AM", value: 5.5 },
    { time: "6AM", value: 6 },
    { time: "6:30AM", value: 6.5 },
    { time: "7AM", value: 7 },
    { time: "7:30AM", value: 7.5 },
    { time: "8AM", value: 8 },
    { time: "8:30AM", value: 8.5 },
    { time: "9AM", value: 9 },
    { time: "9:30AM", value: 9.5 },
    { time: "10AM", value: 10 },
    { time: "10:30AM", value: 10.5 },
    { time: "11AM", value: 11 },
    { time: "11:30AM", value: 11.5 },
    { time: "12PM", value: 12 },
    { time: "12:30PM", value: 12.5 },
    { time: "1PM", value: 13 },
    { time: "1:30PM", value: 13.5 },
    { time: "2PM", value: 14 },
    { time: "2:30PM", value: 14.5 },
    { time: "3PM", value: 15 },
    { time: "3:30PM", value: 15.5 },
    { time: "4PM", value: 16 },
    { time: "4:30PM", value: 16.5 },
    { time: "5PM", value: 17 },
    { time: "5:30PM", value: 17.5 },
    { time: "6PM", value: 18 },
    { time: "6:30PM", value: 18.5 },
    { time: "7PM", value: 19 },
    { time: "7:30PM", value: 19.5 },
    { time: "8PM", value: 20 },
    { time: "8:30PM", value: 20.5 },
    { time: "9PM", value: 21 },
    { time: "9:30PM", value: 21.5 },
    { time: "10PM", value: 22 },
    { time: "10:30PM", value: 22.5 },
    { time: "11PM", value: 23 },
    { time: "11:30PM", value: 23.5 },
  ];
  const defaultBreak = [
    {
      time: "15 Min",
      value: 0.25,
    },
    {
      time: "30 Min",
      value: 0.5,
    },
    {
      time: "45 Min",
      value: 0.75,
    },
    { time: "1 Hr 15 Min", value: 1.25 },
    { time: "1 Hr 30 Min", value: 1.5 },
    { time: "1 Hr 45 Min", value: 1.75 },
    { time: "2 Hr", value: 2 },
  ];

  const daysOfWeek = [] as string[];

  let noteDialog: HTMLDialogElement;

  let startingDay = dayjs($currentTimesheet.weekId);
  for (let i = 0; i < 7; i++) {
    let builtDay = `${(startingDay.month() + 1).toString().padStart(2, "0")}/${startingDay.date().toString().padStart(2, "0")}/${startingDay.year().toString()}`;
    daysOfWeek.push(builtDay);
    startingDay = startingDay.add(1, "day");
  }

  $: totalHours = 0;
  $: currentDayNote = {} as Day;
  onMount(() => {
    calculateTotalHours();
  });

  const handleUpdate = (day: Day, field: string, value: string) => {
    currentTimesheet.set({
      ...$currentTimesheet,
      days: [
        ...$currentTimesheet.days.map((x: Day) => {
          if (x.id === day.id) {
            x[field] = value;
          }
          if (Number(x.end) !== 0 && Number(x.start) !== 0) {
            const start =
              defaultHours.find((y) => y.time === x.start)?.value ?? 0;
            const end = defaultHours.find((y) => y.time === x.end)?.value ?? 0;
            const breakTime =
              defaultBreak.find((y) => y.time === x.break)?.value ?? 0;
            x.total =
              start > end
                ? 24 - start + end - breakTime
                : end - start - breakTime;
          }
          return x;
        }),
      ],
    });
    calculateTotalHours();
  };

  const handlePost = async () => {
    const response = await post(
      `timesheet/${$page.params.id}`,
      $currentTimesheet
    );
    currentTimesheet.set({
      ...$currentTimesheet,
      days: [...$currentTimesheet.days].sort((a, b) => {
        if (a.date > b.date) {
          return 1;
        } else if (a.date === b.date) {
          return a.start > b.start ? 1 : -1;
        }
        return -1;
      }),
    });
    toast.success("Saved timesheet");
  };

  const handleSubmit = async () => {
    let days = $currentTimesheet.days.filter(x => x.total > 0);
    if(!days.length){
      toast.error('Cannot submit a timesheet with no hours');
    }
    else{
      const response = await post(`timesheet/user/submit`, $currentTimesheet);
  
      currentTimesheet.set({ ...response.data });
      toast.success("Submitted timesheet for approval");
    }
  };

  const handleRemove = (day: Day) => {
    let days = $currentTimesheet.days;

    days.splice(
      days.findIndex((x) => x.id === day.id),
      1
    );
    currentTimesheet.set({
      ...$currentTimesheet,
      days,
    });
    toast.success("Deleted row from timesheet, remember to save");
    calculateTotalHours();
  };

  const handleStatus = async (status: string) => {
    currentTimesheet.set({ ...$currentTimesheet, status });

    const response = await post(
      `timesheet/review/status`,
      $currentTimesheet
    );

    currentTimesheet.set({ ...response.data });
    toast.success(`${status} timesheet`);

  };

  const calculateTotalHours = () => {
    totalHours = $currentTimesheet.days.reduce(
      (accum: number, currentValue: Day) => {
        const start = defaultHours.find(
          (y) => y.time === currentValue.start
        )?.value;
        const end = defaultHours.find(
          (y) => y.time === currentValue.end
        )?.value;
        const breakTime =
          defaultBreak.find((y) => y.time === currentValue.break)?.value ?? 0;
        if (end && start) {
          return (accum +=
            start > end
              ? 24 - start + end - breakTime
              : end - start - breakTime);
        }
        return accum;
      },
      0
    );
  };
</script>

<svelte:window
  on:keyup|preventDefault={(e) => {
    if (e.key === "Enter") {
      handlePost();
    }
  }}
/>

<div class="flex gap-4 mb-4 justify-end">
  <dialog
    bind:this={noteDialog}
    class="select-none bg-gradient-to-bl from-slate-900 to-zinc-700 mx-auto my-[15%] py-4 px-2 shadow-lg shadow-black rounded-md outline-none w-1/3"
  >
    <div class="flex flex-col p-4 gap-4">
      <h4 class="text-2xl text-fuchsia-500">{currentDayNote.date} Note</h4>
      {#if isReview}
        <textarea
          class=" shadow-md shadow-black outline-none p-2 rounded"
          name="note"
          bind:value={currentDayNote.note}
          id="currentNote"
        ></textarea>
        <div class="flex justify-between">
          <button
            class="px-8 py-1 hover:shadow-none hover:bg-red-800 transition-all duration-500 font-semibold bg-red-600 rounded-md text-gray-100 text-sm shadow-md shadow-black"
            on:click={() => {
              currentDayNote.note = "";
              noteDialog.close();
            }}>{currentDayNote.note !== "" ? "Clear" : "Cancel"}</button
          >
          <button
            on:click={() => {
              toast.success(`Don't forget to Reject, to send note back`);
              noteDialog.close();
            }}
            class="px-8 py-1 hover:shadow-none hover:bg-lime-800 transition-all duration-500 font-semibold bg-lime-500 rounded-md text-gray-100 text-sm shadow-md shadow-black"
            >Save</button
          >
        </div>
      {:else}
        <p class="dark:text-white text-lg">{currentDayNote.note}</p>
        <button
          on:click={() => {
            noteDialog.close();
          }}
          class="px-8 py-1 hover:shadow-none hover:bg-lime-800 transition-all duration-500 font-semibold bg-lime-500 rounded-md text-gray-100 text-sm shadow-md shadow-black"
          >Close</button
        >
      {/if}
    </div>
  </dialog>
  {#if !isReview && !["Submitted", "Approved", "Paid"].includes($currentTimesheet.status)}
    <button
      on:click={() =>
        currentTimesheet.set({
          ...$currentTimesheet,
          days: [...$currentTimesheet.days, generateDay()],
        })}
      class="px-6 py-0.5 hover:shadow-none hover:bg-teal-500 transition-all duration-500 font-bold bg-teal-300 rounded-md text-gray-800 text-sm shadow-md shadow-black"
      >Add Row</button
    >
    <button
      on:click={() => handlePost()}
      class="px-6 py-0.5 ml-8 hover:shadow-none hover:bg-teal-500 transition-all duration-500 font-bold bg-teal-300 rounded-md text-gray-800 text-sm shadow-md shadow-black"
      >Save</button
    >
    <button
      on:click={() => handleSubmit()}
      class="px-6 py-0.5 hover:shadow-none hover:bg-lime-800 transition-all duration-500 font-semibold bg-lime-500 rounded-md text-gray-100 text-sm shadow-md shadow-black"
      >Submit</button
    >
  {:else if !["Rejected", "Approved"].includes($currentTimesheet.status) && isReview}
    <button
      on:click={() => handleStatus("Rejected")}
      class="px-6 py-0.5 hover:shadow-none mr-10 hover:bg-red-800 transition-all duration-500 font-semibold bg-red-600 rounded-md text-gray-100 text-sm shadow-md shadow-black"
      >Reject</button
    >
    <button
      on:click={() => handleStatus("Approved")}
      class="px-6 py-0.5 hover:shadow-none hover:bg-lime-800 transition-all duration-500 font-semibold bg-lime-500 rounded-md text-gray-100 text-sm shadow-md shadow-black"
      >Approve</button
    >
  {/if}
</div>
<div class="flex gap-4 px-2 justify-between">
  <span class="font-bold text-sm flex items-center gap-4"
    >Week: <span class="text-fuchsia-500 text-xl"
      >{$currentTimesheet.weekId}</span
    ></span
  >
  <span class="font-bold text-sm flex items-center gap-4"
    >Status: <span class="text-fuchsia-500 text-xl"
      >{$currentTimesheet.status}</span
    ></span
  >
  <span class="font-bold text-sm flex items-center gap-4"
    >Total Hours: <span class="text-fuchsia-500 text-xl">{totalHours}</span
    ></span
  >
</div>

<table class="table min-w-full border-separate border-spacing-0 snap-proximity">
  <thead class="text-justify">
    <th
      scope="col"
      class=" border-fuchsia-300 backdrop-blur-xl text-2xl font-semibold sticky top-0 z-0 border-b-[1px] px-2 py-3 border-opacity-75"
    >
      <h4 class="text-fuchsia-400">Date</h4>
    </th>
    <th
      scope="col"
      class="border-fuchsia-300 backdrop-blur-xl text-2xl font-semibold sticky top-0 z-0 border-b-[1px] px-2 py-3 border-opacity-75"
    >
      <h4 class="text-fuchsia-400">Start</h4>
    </th>
    <th
      scope="col"
      class="border-fuchsia-300 backdrop-blur-xl text-2xl font-semibold sticky top-0 z-0 border-b-[1px] px-2 py-3 border-opacity-75"
    >
      <h4 class="text-fuchsia-400">Break</h4>
    </th>
    <th
      scope="col"
      class="border-fuchsia-300 backdrop-blur-xl text-2xl font-semibold sticky top-0 z-10 border-b-[1px] px-2 py-3 border-opacity-75"
    >
      <h4 class="text-fuchsia-400">End</h4>
    </th>
    <th
      scope="col"
      class="border-fuchsia-300 backdrop-blur-xl text-2xl font-semibold sticky top-0 z-10 border-b-[1px] px-2 py-3 border-opacity-75"
    >
      <h4 class="text-fuchsia-400">Charge Code</h4>
    </th>
    <th
      scope="col"
      class="border-fuchsia-300 backdrop-blur-xl text-2xl font-semibold sticky top-0 z-10 border-b-[1px] px-2 py-3 border-opacity-75"
    >
      <h4 class="text-fuchsia-400">Daily Total</h4>
    </th>
  </thead>
  <tbody class="">
    {#each $currentTimesheet?.days as day (day.id)}
      <tr
        class=" table-row dark:dark:hover:bg-gray-900 hover:bg-gray-300 hover:bg-gray-100 duration-500 transition-all"
        in:blur={{ duration: 700 }}
        out:blur={{ duration: 500, opacity:74 }}
      >
        <td
          class=" min-w-36 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-lg font-medium"
        >
          {#if isReview}
            <h5>{day.date}</h5>
          {:else}
            <select
              name=""
              on:change={(e) => handleUpdate(day, "date", e.target?.value)}
              class="bg-transparent text-center"
              value={day.date}
              id=""
            >
              {#each daysOfWeek as dayOfWeek}
                <option class="dark:text-white bg-slate-900" value={dayOfWeek}
                  >{dayOfWeek}</option
                >
              {/each}
            </select>
          {/if}
        </td>
        <td
          class="w-28 min-w-28 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-lg tracking-widest font-medium"
        >
          {#if isReview}
            <h5>{day.start}</h5>
          {:else}
            <input
              class="bg-transparent"
              type="text"
              autocomplete="off"
              on:change={(e) => handleUpdate(day, "start", e.target?.value)}
              name="start"
              value={day.start}
              list="startHours"
            />
            <datalist id="startHours">
              {#each defaultHours as hour}
                <option value={hour.time}>{hour.time}</option>
              {/each}
            </datalist>
          {/if}
        </td>
        <td
          class="w-36 min-w-36 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-lg tracking-widest font-medium"
        >
          {#if isReview}
            <h5>{day.break}</h5>
          {:else}
            <input
              class="bg-transparent"
              autocomplete="off"
              type="text"
              on:change={(e) => handleUpdate(day, "break", e.target?.value)}
              name="end"
              value={day.break}
              list="breakTime"
            />
            <datalist id="breakTime">
              {#each defaultBreak as hour}
                <option value={hour.time}>{hour.time}</option>
              {/each}
            </datalist>
          {/if}
        </td>
        <td
          class="w-28 min-w-28 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-lg tracking-widest font-medium"
        >
          {#if isReview}
            <h5>{day.end}</h5>
          {:else}
            <input
              class="bg-transparent"
              autocomplete="off"
              type="text"
              on:change={(e) => handleUpdate(day, "end", e.target?.value)}
              name="end"
              value={day.end}
              list="endHours"
            />
            <datalist id="endHours">
              {#each defaultHours as hour}
                <option value={hour.time}>{hour.time}</option>
              {/each}
            </datalist>
          {/if}
        </td>
        <td
          class=" min-w-44 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-lg font-medium"
        >
          {#if isReview}
            <h5>{day.chargeCode}</h5>
          {:else}
            <input
              class="bg-transparent"
              type="text"
              autocomplete="off"
              on:change={(e) =>
                handleUpdate(day, "chargeCode", e.target?.value)}
              name="start"
              value={day.chargeCode}
              list="chargeCodes"
            />
            <datalist id="chargeCodes">
              {#each $projectChargeCodes as code}
                <option value={code.code}>{code.code}</option>
              {/each}
            </datalist>
          {/if}
        </td>
        <td
          class="min-w-12 w-12 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-lg tracking-widest font-medium"
        >
          <div class="flex gap-4 justify-between relative">
            {day.total}
            {#if !isReview}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <i
                on:click={() => handleRemove(day)}
                class="peer bi bi-trash3 hover:text-fuchsia-500 hover:cursor-pointer duration-500 transition-all"
              ></i>

              <div
                class=" hidden peer-hover:block absolute bottom-full left-1/3 z-50 backdrop-blur-md bg-red-500 px-2 py-1 text-sm rounded-md shadow-sm shadow-black"
              >
                Remove
              </div>
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              {#if day.note !== "" && day.note !== undefined}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <i
                  on:click={() => {
                    currentDayNote = day;
                    noteDialog.showModal();
                  }}
                  class="peer bi bi-newspaper hover:text-fuchsia-500 hover:cursor-pointer duration-500 transition-all"
                ></i>
                <div
                  class=" hidden peer-hover:block absolute bottom-full left-1/3 z-50 backdrop-blur-md bg-slate-800 px-2 py-1 text-sm rounded-md shadow-sm shadow-black"
                >
                  Review Note
                </div>
              {/if}
            {:else if day.note === "" || day.note === undefined}
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <i
                on:click={() => {
                  currentDayNote = day;
                  noteDialog.showModal();
                }}
                class="peer bi bi-pencil-square hover:text-fuchsia-500 hover:cursor-pointer duration-500 transition-all"
              ></i>
              <div
                class=" hidden peer-hover:block absolute bottom-full left-1/3 z-50 backdrop-blur-md bg-slate-800 px-2 py-1 text-sm rounded-md shadow-sm shadow-black"
              >
                Add Note
              </div>
            {:else}
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <i
                on:click={() => {
                  currentDayNote = day;
                  currentDayNote.hadValue = true;
                  noteDialog.showModal();
                }}
                class="peer bi bi-newspaper hover:text-fuchsia-500 hover:cursor-pointer duration-500 transition-all"
              ></i>
              <div
                class=" hidden peer-hover:block absolute bottom-full left-1/3 z-50 backdrop-blur-md bg-slate-800 px-2 py-1 text-sm rounded-md shadow-sm shadow-black"
              >
                Review Note
              </div>
            {/if}
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
