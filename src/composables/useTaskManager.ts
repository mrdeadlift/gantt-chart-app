import { ref, computed } from 'vue'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task'

export function useTaskManager() {
  const tasks = ref<Task[]>([])

  function generateId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function validateCreateInput(input: CreateTaskInput): void {
    if (!input.name || input.name.trim() === '') {
      throw new Error('タスク名は必須です')
    }

    if (input.endDate <= input.startDate) {
      throw new Error('終了日は開始日より後である必要があります')
    }
  }

  function createTask(input: CreateTaskInput): Task {
    validateCreateInput(input)

    const newTask: Task = {
      id: generateId(),
      name: input.name.trim(),
      startDate: input.startDate,
      endDate: input.endDate,
      progress: 0,
      description: input.description,
      dependencies: input.dependencies || []
    }

    tasks.value.push(newTask)
    return newTask
  }

  function getTaskById(id: string): Task | undefined {
    return tasks.value.find(task => task.id === id)
  }

  function updateTask(input: UpdateTaskInput): Task | null {
    const taskIndex = tasks.value.findIndex(task => task.id === input.id)
    
    if (taskIndex === -1) {
      return null
    }

    const existingTask = tasks.value[taskIndex]
    const updatedTask: Task = {
      ...existingTask,
      ...Object.fromEntries(
        Object.entries(input).filter(([key, value]) => key !== 'id' && value !== undefined)
      )
    }

    // 更新後の検証
    if (updatedTask.endDate <= updatedTask.startDate) {
      throw new Error('終了日は開始日より後である必要があります')
    }

    if (!updatedTask.name || updatedTask.name.trim() === '') {
      throw new Error('タスク名は必須です')
    }

    if (updatedTask.progress < 0 || updatedTask.progress > 100) {
      throw new Error('進捗率は0-100の範囲で設定してください')
    }

    tasks.value[taskIndex] = updatedTask
    return updatedTask
  }

  function deleteTask(id: string): boolean {
    const taskIndex = tasks.value.findIndex(task => task.id === id)
    
    if (taskIndex === -1) {
      return false
    }

    // 依存関係のクリーンアップ
    tasks.value.forEach(task => {
      task.dependencies = task.dependencies.filter(depId => depId !== id)
    })

    tasks.value.splice(taskIndex, 1)
    return true
  }

  const sortedTasks = computed(() => {
    return [...tasks.value].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  })

  return {
    tasks: tasks,
    sortedTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
  }
}