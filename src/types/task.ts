export interface Task {
  id: string
  name: string
  startDate: Date
  endDate: Date
  progress: number // 0-100の進捗率
  description?: string
  dependencies: string[] // 依存するタスクのID配列
}

export interface TaskDependency {
  fromTaskId: string
  toTaskId: string
  type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish'
}

export interface GanttData {
  tasks: Task[]
  dependencies: TaskDependency[]
  startDate: Date
  endDate: Date
}

export interface CreateTaskInput {
  name: string
  startDate: Date
  endDate: Date
  description?: string
  dependencies?: string[]
}

export interface UpdateTaskInput {
  id: string
  name?: string
  startDate?: Date
  endDate?: Date
  progress?: number
  description?: string
  dependencies?: string[]
}