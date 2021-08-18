<script>
  import { CurrentStage, ReposToDelete } from "./stores";
  import {formatDistance, parseJSON} from 'date-fns';

  function handleStageIncrement() {
    CurrentStage.update((n) => n + 1);
  }

  function handleStageDecrement() {
    CurrentStage.update((n) => n - 1);
  }

  function formatDate(msDate) {
    return formatDistance(parseJSON(msDate), Date.now(), {addSuffix:true});
  }
</script>

<div>
  <div class="button-group">
    <button class="button stager" on:click={handleStageDecrement}
      ><span class="material-icons">arrow_back</span>
      <span>go back</span></button
    >
    <button class="button stager" on:click={handleStageIncrement}
      ><span>keep going</span>
      <span class="material-icons">arrow_forward</span>
    </button>
  </div>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Private</th>
          <th scope="col">Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {#each $ReposToDelete as repo (repo.id)}
          <tr>
            <td>
              <div class="name-col">
                <span>
                  {repo.name}
                </span>
                <a href={repo.html_url} target="_blank" rel="noopener noreferer">
                  <span class="material-icons">open_in_browser</span>
                </a>
              </div>
            </td>
            <td>{repo.description === null ? "" : repo.description}</td>
            <td>{repo.private}</td>
            <td>{formatDate(repo.updated_at)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  @media (min-width: 640px) {
    .table-container {
      border-radius: 0.5em;
    }
  }

  .table-container {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border-color: rgba(229, 231, 235, 1);
    border-bottom-width: 1px;
    overflow: hidden;
  }

  .name-col {
      display: flex;
      justify-content: space-between;
  }

  table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    /* border: 3px solid purple; */
  }

  th {
    display: table-cell;
    vertical-align: inherit;
    color: rgb(107, 114, 128);
    text-transform: uppercase;
  }

  thead {
    display: table-header-group;
    background-color: rgba(249, 250, 251, 1);
    vertical-align: middle;
  }

  tbody {
    /* border-top-color: rgb(229, 231, 235);
    border-top-width: 1px;
    border-top-style: solid; */
    background-color: white;
    vertical-align: middle;
  }

  tbody tr {
    border-top-color: rgb(229, 231, 235);
    border-top-width: 1px;
    border-top-style: solid;
  }

  tr {
    display: table-row;
    vertical-align: inherit;
  }

  td {
    vertical-align: inherit;
    display: table-cell;
  }

  thead th:nth-child(1) {
    width: 20%;
  }
  thead th:nth-child(2) {
    width: 30%;
  }
  thead th:nth-child(3) {
    width: 20%;
  }
  thead th:nth-child(4) {
    width: 20%;
  }

  th,
  td {
    padding: 1.5em;
  }

  th {
    letter-spacing: 2px;
  }
  td {
    letter-spacing: 1px;
  }

  tbody td {
    text-align: center;
  }
</style>
