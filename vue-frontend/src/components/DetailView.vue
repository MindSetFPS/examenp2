<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from './LoadingSpinner.vue' // Import the spinner

const route = useRoute()
const itemDetails = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchData = async (entity, id) => {
  loading.value = true
  error.value = null
  itemDetails.value = null
  try {
    const url = `/api/${entity}/${id}/` // Fetch from Express proxy
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    itemDetails.value = await response.json()
  } catch (e) {
    error.value = e
    console.error('Error fetching details:', e)
  } finally {
    loading.value = false
  }
}

watch(
  () => [route.params.entity, route.params.id],
  ([newEntity, newId]) => {
    if (newEntity && newId) {
      fetchData(newEntity, newId)
    }
  },
  { immediate: true }
)

const formatKey = (key) => {
  return key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
</script>

<template>
  <div class="detail-view">
    <router-link :to="`/${route.params.entity}`" class="back-link">&lt; Back to {{ route.params.entity }} List</router-link>
    <h2 v-if="itemDetails">{{ itemDetails.name || itemDetails.title }}</h2>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    <div v-else-if="itemDetails" class="details-card">
      <div v-for="(value, key) in itemDetails" :key="key" class="detail-item">
        <strong v-if="!Array.isArray(value) && typeof value !== 'object'">{{ formatKey(key) }}:</strong>
        <span v-if="!Array.isArray(value) && typeof value !== 'object'"> {{ value }}</span>
        <div v-else-if="Array.isArray(value)">
          <strong>{{ formatKey(key) }}:</strong>
          <ul>
            <li v-for="(item, index) in value" :key="index">
              <span v-if="typeof item === 'string'">{{ item }}</span>
              <!-- Add more sophisticated handling for nested objects/links later if needed -->
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  margin-top: 30px;
  text-align: left;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  padding: 25px;
  border: 1px solid #444;
  border-radius: 10px;
  background-color: #2b2b2b; /* Slightly lighter than body for contrast */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.back-link {
  display: inline-block;
  margin-bottom: 25px;
  color: #42b983; /* Green for links */
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #53d09a;
  text-decoration: underline;
}

h2 {
  text-align: center;
  color: #ffe81f; /* Star Wars yellow */
  margin-bottom: 30px;
  border-bottom: 1px solid #444;
  padding-bottom: 15px;
}

.details-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Responsive grid for details */
  gap: 15px;
}

.detail-item {
  background-color: #383838; /* Background for each detail field */
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #555;
  word-break: break-word; /* Ensure long words break */
}

.detail-item strong {
  color: #f0f0f0; /* Light color for labels */
  display: block;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.detail-item span {
  color: #ccc; /* Slightly dimmer for values */
}

.detail-item ul {
  list-style: none;
  padding-left: 0;
  margin-top: 5px;
}

.detail-item li {
  background-color: #484848; /* Background for array items */
  padding: 5px 10px;
  margin-bottom: 3px;
  border-radius: 3px;
  color: #ccc;
  font-size: 0.9em;
}

.error {
  color: #ff4d4d;
  margin-top: 20px;
  text-align: center;
  font-size: 1.1em;
}
</style>
