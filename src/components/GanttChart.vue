<template>
  <div class="gantt-chart">
    <div class="gantt-header">
      <div class="task-column">タスク</div>
      <div class="timeline-column">
        <div data-testid="date-header" class="date-header">
          <div
            v-for="date in dateRange"
            :key="date.toISOString()"
            :data-testid="`date-${formatDate(date)}`"
            class="date-cell"
          >
            {{ formatDate(date) }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="gantt-body">
      <div v-if="tasks.length === 0" class="no-tasks">
        タスクがありません
      </div>
      <div
        v-for="task in tasks"
        :key="task.id"
        :data-testid="`task-${task.id}`"
        class="task-row"
        @click="$emit('task-click', task)"
      >
        <div class="task-name">{{ task.name }}</div>
        <div class="task-timeline">
          <div
            :data-testid="`task-${task.id}-bar`"
            class="task-bar"
            :style="getTaskBarStyle(task)"
            @click.stop="$emit('task-bar-click', task)"
          >
            <div
              :data-testid="`task-${task.id}-progress`"
              class="task-progress"
              :style="getProgressStyle(task)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '../types/task'

interface Props {
  tasks: Task[]
  startDate: Date
  endDate: Date
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'task-click': [task: Task]
  'task-bar-click': [task: Task]
}>()

// デバッグ用
console.log('GanttChart.vue - props.tasks:', props.tasks)
console.log('GanttChart.vue - props.startDate:', props.startDate)
console.log('GanttChart.vue - props.endDate:', props.endDate)

const dateRange = computed(() => {
  const dates: Date[] = []
  const current = new Date(props.startDate)
  const end = new Date(props.endDate)
  
  while (current <= end) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  return dates
})

const totalDays = computed(() => {
  return Math.ceil((props.endDate.getTime() - props.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
})

const formatDate = (date: Date): string => {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const getTaskBarStyle = (task: Task) => {
  const taskStart = new Date(task.startDate)
  const taskEnd = new Date(task.endDate)
  const chartStart = new Date(props.startDate)
  const chartEnd = new Date(props.endDate)
  
  const startOffset = Math.max(0, Math.ceil((taskStart.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24)))
  const taskDuration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  const leftPercent = (startOffset / totalDays.value) * 100
  const widthPercent = (taskDuration / totalDays.value) * 100
  
  return {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`
  }
}

const getProgressStyle = (task: Task) => {
  return {
    width: `${task.progress}%`
  }
}
</script>

<style scoped>
.gantt-chart {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.gantt-header {
  display: flex;
  background-color: #f3f4f6;
  border-bottom: 1px solid #d1d5db;
}

.task-column {
  width: 192px;
  padding: 12px;
  font-weight: 600;
  border-right: 1px solid #d1d5db;
}

.timeline-column {
  flex: 1;
}

.date-header {
  display: flex;
}

.date-cell {
  flex: 1;
  padding: 8px;
  text-align: center;
  font-size: 14px;
  border-right: 1px solid #e5e7eb;
}

.date-cell:last-child {
  border-right: 0;
}

.gantt-body {
  background-color: white;
}

.task-row {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
}

.task-row:hover {
  background-color: #f9fafb;
}

.task-name {
  width: 192px;
  padding: 12px;
  border-right: 1px solid #d1d5db;
}

.task-timeline {
  flex: 1;
  position: relative;
  height: 48px;
}

.task-bar {
  position: absolute;
  top: 8px;
  height: 32px;
  background-color: #3b82f6;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.task-bar:hover {
  background-color: #2563eb;
}

.task-progress {
  height: 100%;
  background-color: #1d4ed8;
  border-radius: 4px;
}

.no-tasks {
  padding: 16px;
  text-align: center;
  color: #6b7280;
}
</style>