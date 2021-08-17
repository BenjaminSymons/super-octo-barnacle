<script>
  import { onMount } from "svelte";
  import { PersonalAccessToken, UserObject } from "./stores.js";
  import Repos from "./Repos.svelte";
  import { fly, fade } from "svelte/transition";

  let pid = "";
  let pidValid = false;

  let stage = 0;

  async function getUserDetails(PAT) {
    let user = await fetch("https://api.github.com/user", {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/vnd.github.v3+.json",
        Authorization: "Bearer " + PAT,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not successful");
        }
        pidValid = true;
        return response.json();
      })
      .catch((error) => {
        console.error("The Personal Access Token entered is not valid.", error);
      });
    return user;
  }

  async function handlePIDSubmit() {
    let user = await getUserDetails(pid);
    if (user) {
      PersonalAccessToken.set(pid);
      localStorage.setItem("_token", pid);
      localStorage.setItem("_login", user.login);
      UserObject.set(user);
    }
  }

  function handleStageIncrement() {
    stage = stage + 1;
  }

  function handleStageDecrement() {
    stage = stage - 1;
  }

  function handleIncorrectUser() {
    UserObject.set(undefined);
    localStorage.removeItem("_token");
    PersonalAccessToken.set(undefined);
  }

  onMount(() => {
    let token = localStorage.getItem("_token");
    if (token) {
      PersonalAccessToken.set(token);
      getUserDetails($PersonalAccessToken).then((user) => {
        UserObject.set(user);
      });
    }
  });
</script>

<main>
  <h1>Repo Sweeper</h1>
  {#if stage === 0}
    <div out:fly={{ x: -200, duration: 300 }} in:fade={{ delay: 400 }}>
      {#if $UserObject !== undefined}
        <h2>{$UserObject?.login}</h2>
        <img
          alt="Avatar associated with github account"
          src={$UserObject?.avatar_url}
          class="avatar"
        />

        <h2>This you?</h2>
        <button class="button" on:click={handleStageIncrement}>Yeah</button>
        <button class="button" on:click={handleIncorrectUser}>Nah</button>
      {/if}

      {#if $UserObject === undefined}
        <label for="pidInput">Personal Access Token</label>
        <input bind:value={pid} id="pidInput" class="box" />
        <button class="button" on:click={handlePIDSubmit}>Submit</button>
      {/if}
      <!-- <p>The pid value is {pid}</p> -->
      <p>Stored Token: {$PersonalAccessToken}</p>
      <!-- <p>Stored User Object: {$UserObject}</p> -->
    </div>
  {/if}
  {#if stage === 1}
    <div out:fly={{ x: -200, duration: 300 }} in:fade={{ delay: 400 }}>
      <Repos>
        <button class="button stager" on:click={handleStageDecrement}
          >← go back</button
        >
      </Repos>
    </div>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    user-select: none;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  h2 {
    font-size: 2em;
    font-weight: 200;
    user-select: none;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .box {
    width: 500px;
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
    margin: 0 0 1em 0;
  }

  .button:hover {
    background-color: hsl(0, 0%, 88%);
  }

  .stager {
    text-align: left;
    border-radius: 1em;
  }

  .stager:hover {
    background-color: hsl(0, 0%, 88%);
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 2px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 4px 6px 3px rgba(0, 0, 0, 0.2);
  }
</style>
