import { writable } from 'svelte/store'

export const PersonalAccessToken = writable()
export const UserObject = writable()
export const CurrentStage = writable(2)
export const ReposToDelete = writable()