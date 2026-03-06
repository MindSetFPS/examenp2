<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const items = ref([])
const loading = ref(true)
const error = ref(null)
const next = ref(null)
const previous = ref(null)
const searchQuery = ref('')
const searchError = ref(null)

const fetchData = async (entity, page = 1, search = '') => {
  loading.value = true
  error.value = null
  searchError.value = null
  try {
    let url = `/api/${entity}/`
    if (search) {
      // Check if search query is a number (potential ID)
      if (!isNaN(search) && !isNaN(parseFloat(search))) {
        // Try to fetch by ID directly
        const idUrl = `/api/${entity}/${search}/`
        const idResponse = await fetch(idUrl)
        if (idResponse.ok) {
          const item = await idResponse.json()
          items.value = [item] // Display single item in a list
          next.value = null
          previous.value = null
          loading.value = false
          return
        }
      }
      url += `?search=${search}` // Fallback to search query
    } else {
      url += `?page=${page}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    items.value = data.results
    next.value = data.next ? data.next.replace(/^https?:\/\/[^\/]+\/api/, '/api') : null;
    previous.value = data.previous ? data.previous.replace(/^https?:\/\/[^\/]+\/api/, '/api') : null;
  } catch (e) {
    error.value = e
    console.error('Error fetching list:', e)
  } finally {
    loading.value = false
  }
}

const goToDetails = (url) => {
  const parts = url.split('/').filter(Boolean)
  const id = parts[parts.length - 1]
  router.push({ name: 'detail', params: { entity: route.params.entity, id } })
}

const handleSearch = () => {
  if (searchQuery.value.trim() === '') {
    searchError.value = 'Please enter a search term.'
    return
  }
  searchError.value = null
  fetchData(route.params.entity, 1, searchQuery.value.trim())
}

const changePage = (pageUrl) => {
  if (!pageUrl) return;

  const url = new URL(pageUrl);
  const page = url.searchParams.get('page');
  fetchData(route.params.entity, page, searchQuery.value.trim());
}

watch(
  () => route.params.entity,
  (newEntity) => {
    if (newEntity) {
      searchQuery.value = ''; // Clear search query on entity change
      fetchData(newEntity)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="list-view">
    <h2>{{ route.params.entity.charAt(0).toUpperCase() + route.params.entity.slice(1) }}</h2>

    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        placeholder="Search by name or ID..."
      />
      <button @click="handleSearch">Search</button>
      <div v-if="searchError" class="search-error">{{ searchError }}</div>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    <ul v-else-if="items.length">
      <li v-for="item in items" :key="item.url || item.name || item.title">
        <a @click.prevent="goToDetails(item.url)">
          {{ item.name || item.title }}
        </a>
      </li>
    </ul>
    <div v-else class="no-results">No results found.</div>

    <div class="pagination" v-if="!searchQuery">
      <button :disabled="!previous" @click="changePage(previous)">Previous</button>
      <button :disabled="!next" @click="changePage(next)">Next</button>
    </div>
  </div>
</template>

<style scoped>
.list-view {
  margin-top: 30px;
}
.list-view h2 {
  text-transform: capitalize;
  margin-bottom: 20px;
}
.search-container {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.search-container input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #555;
  background-color: #333;
  color: #f0f0f0;
  width: 250px;
}
.search-container input::placeholder {
  color: #aaa;
}
.search-error {
  color: #ff4d4d;
  margin-top: 5px;
  width: 100%;
  text-align: center;
}
.no-results {
  color: #ccc;
  margin-top: 20px;
  font-size: 1.1em;
}
.list-view ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Responsive grid */
  gap: 20px;
  padding: 0;
}
.list-view li {
  background-color: #333; /* Darker background for list items */
  border: 1px solid #444;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.list-view li:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
.list-view a {
  color: #ffe81f; /* Star Wars yellow for links */
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  display: block; /* Make the whole list item clickable */
}
.list-view a:hover {
  text-decoration: underline;
}
.error {
  color: #ff4d4d; /* Red for errors */
  margin-top: 20px;
  font-size: 1.1em;
}
.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style>
