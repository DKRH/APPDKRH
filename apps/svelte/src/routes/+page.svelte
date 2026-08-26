<script lang="ts">
  import { onMount } from "svelte";

  import { apiFetch } from "$lib/api";

  import type {
    BPassbank,
    NewBPassbank,
  } from "@dkrh/types";

  let passbanks = $state<BPassbank[]>([]);

  let loading = $state(true);

  let newPassbank = $state<NewBPassbank>({
    title: "",
    username: "",
  });

  async function loadPassbanks() {
    loading = true;

    try {
      const response = await apiFetch(
        "/api/b-passbank",
      );

      if (!response.ok) {
        throw new Error(
          `Failed: ${response.status}`,
        );
      }

      const payload =
        await response.json() as BPassbank[];

      passbanks = payload;
    } catch (error) {
      console.error(error);
    } finally {
      loading = false;
    }
  }

  async function createPassbank() {
    const response = await apiFetch(
      "/api/b_passbank",
      {
        method: "POST",

        body: JSON.stringify(
          newPassbank,
        ),
      },
    );

    if (!response.ok) {
      console.error(
        "Failed to create passbank",
      );

      return;
    }

    const created =
      await response.json() as BPassbank;

    passbanks = [
      ...passbanks,
      created,
    ];

    newPassbank = {
      title: "",
      username: "",
    };
  }

  onMount(() => {
    loadPassbanks();
  });
</script>

{#if loading}
  <p>Loading...</p>
{:else}
  {#each passbanks as passbank}
    <div>
      <strong>{passbank.title}</strong>

      <p>{passbank.username}</p>

      <p>{passbank.note}</p>
    </div>
  {/each}
{/if}