// Rehydration von „Mein Programm“ beim Start im Browser (siehe State-Management-Konzept)
export default defineNuxtPlugin(() => {
  useMyProgram().hydrate()
})
