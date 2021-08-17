<script>
  import { onMount } from "svelte";
  import { quintOut, quintInOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { PersonalAccessToken, UserObject } from "./stores.js";

  let repos = [];
  let isLoading = true;

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `
              transform: ${transform} scale(${t});
              opacity: ${t}
              `,
      };
    },
  });

  onMount(async () => {
    let login = localStorage.getItem("_login");
    const res = await fetch(`https://api.github.com/users/${login}/repos`);
    repos = await res.json();
    repos = repos.map((obj) => ({ ...obj, selected: false }));
    isLoading = false;
  });
</script>

<div class="page">
    <slot />
  {#if isLoading}
    <p>loading...</p>
  {/if}
  {#if !isLoading}
    <div class="board">
      <div class="left">
        <h2>repos</h2>
        {#each repos.filter((t) => !t.selected) as repo (repo.id)}
          <label
            in:receive={{ key: repo.id }}
            out:send={{ key: repo.id }}
            animate:flip
            ><input
              type="checkbox"
              bind:checked={repo.selected}
            />{repo.name}</label
          >
        {/each}
      </div>
      <div class="right">
        <h2>to delete</h2>
        {#each repos.filter((t) => t.selected) as repo (repo.id)}
          <label
            in:receive={{ key: repo.id }}
            out:send={{ key: repo.id }}
            animate:flip
            ><input
              type="checkbox"
              bind:checked={repo.selected}
            />{repo.name}</label
          >
        {/each}
      </div>
    </div>
  {/if}

</div>

<style>
  .board {
    display: flex;
    justify-content: center;
    width: 80vw;
  }
  .left,
  .right {
    padding: 0 1em 0 0;
    box-sizing: border-box;
    width: 50%;
  }
  input {
    margin: 0;
  }

  input[type="checkbox"] {
    margin: 3px 3px 3px 4px;
  }

  label {
    text-align: left;
    top: 0;
    left: 0;
    display: block;
    font-size: 1em;
    line-height: 1;
    padding: 0.5em;
    margin: 0 auto 0.5em auto;
    border-radius: 2px;
    background-color: #eee;
    user-select: none;
    -moz-user-select: none;
  }

  h2 {
    font-size: 2em;
    font-weight: 200;
    user-select: none;
  }

  .right label {
    background-color: rgb(180, 240, 100);
  }

.page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

</style>
