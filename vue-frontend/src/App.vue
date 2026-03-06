<template>
  <div id="app">
    <nav>
      <router-link to="/people">People</router-link> |
      <router-link to="/films">Films</router-link> |
      <router-link to="/planets">Planets</router-link> |
      <router-link to="/species">Species</router-link> |
      <router-link to="/starships">Starships</router-link> |
      <router-link to="/vehicles">Vehicles</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f0f0f0; /* Use global text color */
  margin-top: 20px; /* Reduce top margin */
}

nav {
  padding: 15px 0;
  background-color: #333; /* Darker background for nav */
  margin-bottom: 30px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  gap: 20px; /* Space out links */
  flex-wrap: wrap; /* Allow links to wrap on smaller screens */
}

nav a {
  font-weight: bold;
  color: #f0f0f0; /* Light color for links */
  text-decoration: none;
  padding: 5px 10px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

nav a:hover {
  color: #ffe81f; /* Star Wars yellow on hover */
  background-color: #555;
  border-radius: 4px;
}

nav a.router-link-exact-active {
  color: #ffe81f; /* Active link in Star Wars yellow */
  background-color: #444;
  border-radius: 4px;
}
</style>
