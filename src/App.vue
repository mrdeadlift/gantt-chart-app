<script setup lang="ts">
import GanttChart from './components/GanttChart.vue'
import { useTaskManager } from './composables/useTaskManager'

const { tasks } = useTaskManager()

const startDate = new Date('2024-01-01')
const endDate = new Date('2024-01-31')

const handleTaskClick = (task: any) => {
  console.log('Task clicked:', task)
}

const handleTaskBarClick = (task: any) => {
  console.log('Task bar clicked:', task)
}

// デバッグ用
console.log('App.vue - tasks:', tasks.value)
console.log('App.vue - startDate:', startDate)
console.log('App.vue - endDate:', endDate)
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>ガントチャートジェネレーター</h1>
    </header>

    <main class="app-main">
      <GanttChart 
        :tasks="tasks"
        :start-date="startDate"
        :end-date="endDate"
        @task-click="handleTaskClick"
        @task-bar-click="handleTaskBarClick"
      />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f9fafb;
}

.app-header {
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.app-header h1 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  text-align: center;
}

.app-main {
  padding: 24px;
}
</style>
