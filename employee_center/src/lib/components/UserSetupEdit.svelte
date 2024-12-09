<script lang="ts">
  import toast from "svelte-french-toast";
  import { project, type User as UserData } from "$lib/stores/layout";
  import { post, put } from "$lib/database/server";

  export let user: UserData;
  export let reportsTo: UserData[];
  export let isNew: boolean;

  const updateUser = async () => {
    let reportsTo = user?.reportsTo === 0 ? 0 : Number(user?.reportsTo);

    const response = await put("user", Number(user?.id), {
      ...user,
      reportsTo,
    });
    toast.success(`Updated ${user?.firstName} ${user?.lastName}'s info`);
  };

  const createUser = async () => {
    let reportsTo = user?.reportsTo === 0 ? 0 : Number(user?.reportsTo);
    await post("user/create", {
      ...user,
      reportsTo,
      projectId: [$project?.projectId]
    });
    toast.success(`Created ${user?.firstName} ${user?.lastName}'s login`);
  };

</script>

{#if isNew}
  <div class="flex justify-center gap-2 mb-4">
    <h4 class="text-center text-2xl">New User for:</h4>
    <span class="font-[bell] text-fuchsia-500 text-2xl">{$project?.name}</span>
  </div>
{:else}
  <div class="flex justify-center gap-2 mb-4">
    <h4 class="text-center text-2xl">Editing User:</h4>
    <span class=" font-[bell] text-fuchsia-500 text-2xl"
      >{user.firstName} {user.lastName}</span
    >
  </div>
{/if}
<div class="form-container">
  <form action="?/update" method="POST" class="p-4">
    <section class="flex flex-col gap-8">
      <div class="flex flex-wrap gap-4">
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="firstName"
            >First Name
          </label>
          <input
            class="bg-transparent shadow-inner transition-all duration-500 shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            name="firstName"
            bind:value={user.firstName}
          />
        </div>
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="lastName">Last Name</label
          >
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            name="lastName"
            bind:value={user.lastName}
          />
        </div>
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="username"
            >Username
          </label>
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            name="username"
            bind:value={user.username}
          />
        </div>
        {#if isNew}
          <div class="relative">
            <label
              class="text-fuchsia-300 absolute bottom-full text-lg"
              for="username"
              >Temp Password
            </label>
            <input
              class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
              type="password"
              name="password"
              bind:value={user.password}
            />
          </div>
        {/if}
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="role"
            >Role
          </label>
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            name="role"
            bind:value={user.role}
          />
        </div>
        <div class="relative">
          <label class="text-fuchsia-300 absolute bottom-full text-lg" for="ssn"
            >SSN
          </label>
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            name="ein"
            bind:value={user.ssn}
          />
        </div>
        <div class="relative">
          <label class="text-fuchsia-300 absolute bottom-full text-lg" for="ein"
            >EIN
          </label>
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            name="ein"
            bind:value={user.ein}
          />
        </div>
      </div>
      <div class="flex flex-wrap gap-4">
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="street">Street</label
          ><input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            name="street"
            bind:value={user.address.address}
            type="text"
          />
        </div>
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="city">City</label
          ><input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            name="city"
            bind:value={user.address.city}
            type="text"
          />
        </div>
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="state">State</label
          ><input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            name="state"
            bind:value={user.address.state}
            type="text"
          />
        </div>
        <div class="relative">
          <label class="text-fuchsia-300 absolute bottom-full text-lg" for="zip"
            >Zip</label
          ><input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            name="zip"
            bind:value={user.address.postalCode}
            type="text"
          />
        </div>
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="phone">Phone</label
          ><input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            name="phone"
            bind:value={user.phone}
            type="text"
          />
        </div>
        <div class="relative">
          <label class="text-fuchsia-300 absolute bottom-full text-lg" for="mac"
            >Mac Address</label
          ><input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            name="mac"
            bind:value={user.macAddress}
            type="text"
          />
        </div>
      </div>
      <div class="flex flex-wrap gap-4">
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="address"
            >Company Address
          </label>
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            bind:value={user.company.address.address}
          />
        </div>
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="city">Company City</label
          >
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            bind:value={user.company.address.city}
          />
        </div>
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="country">Company Country</label
          >
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            bind:value={user.company.address.country}
          />
        </div>
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="department">Company Department</label
          >
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            name="company.department"
            bind:value={user.company.department}
          />
        </div>
      </div>
      <div class="flex flex-wrap gap-4">
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="reportsTo">Reports To</label
          >
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            autocomplete="off"
            list="user-reports"
            name="reportsTo"
            bind:value={user.reportsTo}
          />
          <datalist id="user-reports">
            {#each reportsTo as admin}
              <option value={admin.id}
                >{admin.firstName} {admin.lastName}</option
              >
            {/each}
          </datalist>
        </div>
        <div class="relative">
          <label
            class="text-fuchsia-300 absolute bottom-full text-lg"
            for="department">Salary</label
          >
          <input
            class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
            type="text"
            name="salary"
            bind:value={user.salary}
          />
        </div>
      </div>
      <div class="flex justify-end">
        <button
          on:click={() => (!isNew ? updateUser() : createUser())}
          class=" transition-all text-black duration-500 rounded bg-lime-500 hover:shadow-none hover:bg-lime-700 hover:text-white text-lg px-8 py-1 shadow-md shadow-slate-800 flex gap-4 content-center"
          type="button"><i class="bi bi-save"></i>Save</button
        >
      </div>
    </section>
  </form>
</div>
