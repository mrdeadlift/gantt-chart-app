import { describe, it, expect } from 'vitest'
import type { Task, TaskDependency, GanttData, CreateTaskInput, UpdateTaskInput } from '../task'

describe('Task Type Definitions', () => {
  it('should create a valid Task object', () => {
    const task: Task = {
      id: 'task-1',
      name: 'テストタスク',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-07'),
      progress: 50,
      description: 'テスト用のタスクです',
      dependencies: ['task-0']
    }

    expect(task.id).toBe('task-1')
    expect(task.name).toBe('テストタスク')
    expect(task.progress).toBe(50)
    expect(task.dependencies).toEqual(['task-0'])
  })

  it('should create a valid TaskDependency object', () => {
    const dependency: TaskDependency = {
      fromTaskId: 'task-1',
      toTaskId: 'task-2',
      type: 'finish-to-start'
    }

    expect(dependency.fromTaskId).toBe('task-1')
    expect(dependency.toTaskId).toBe('task-2')
    expect(dependency.type).toBe('finish-to-start')
  })

  it('should create a valid GanttData object', () => {
    const ganttData: GanttData = {
      tasks: [],
      dependencies: [],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    }

    expect(ganttData.tasks).toEqual([])
    expect(ganttData.dependencies).toEqual([])
    expect(ganttData.startDate).toBeInstanceOf(Date)
    expect(ganttData.endDate).toBeInstanceOf(Date)
  })

  it('should create a valid CreateTaskInput object', () => {
    const createInput: CreateTaskInput = {
      name: '新しいタスク',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-07'),
      description: '新しいタスクの説明',
      dependencies: []
    }

    expect(createInput.name).toBe('新しいタスク')
    expect(createInput.startDate).toBeInstanceOf(Date)
    expect(createInput.endDate).toBeInstanceOf(Date)
    expect(createInput.dependencies).toEqual([])
  })

  it('should create a valid UpdateTaskInput object', () => {
    const updateInput: UpdateTaskInput = {
      id: 'task-1',
      name: '更新されたタスク',
      progress: 75
    }

    expect(updateInput.id).toBe('task-1')
    expect(updateInput.name).toBe('更新されたタスク')
    expect(updateInput.progress).toBe(75)
  })
})