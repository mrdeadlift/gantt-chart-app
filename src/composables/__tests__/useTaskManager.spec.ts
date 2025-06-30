import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskManager } from '../useTaskManager'
import type { CreateTaskInput, UpdateTaskInput } from '../../types/task'

describe('useTaskManager', () => {
  let taskManager: ReturnType<typeof useTaskManager>

  beforeEach(() => {
    taskManager = useTaskManager()
  })

  describe('タスク作成機能', () => {
    it('新しいタスクを作成できる', () => {
      const createInput: CreateTaskInput = {
        name: 'テストタスク',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07'),
        description: 'テスト用のタスク'
      }

      const createdTask = taskManager.createTask(createInput)

      expect(createdTask.id).toBeDefined()
      expect(createdTask.name).toBe('テストタスク')
      expect(createdTask.startDate).toEqual(new Date('2024-01-01'))
      expect(createdTask.endDate).toEqual(new Date('2024-01-07'))
      expect(createdTask.description).toBe('テスト用のタスク')
      expect(createdTask.progress).toBe(0)
      expect(createdTask.dependencies).toEqual([])
    })

    it('依存関係を持つタスクを作成できる', () => {
      const firstTask = taskManager.createTask({
        name: '最初のタスク',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-03')
      })

      const secondTask = taskManager.createTask({
        name: '2番目のタスク',
        startDate: new Date('2024-01-04'),
        endDate: new Date('2024-01-07'),
        dependencies: [firstTask.id]
      })

      expect(secondTask.dependencies).toEqual([firstTask.id])
    })

    it('作成したタスクがタスクリストに追加される', () => {
      const initialCount = taskManager.tasks.value.length

      taskManager.createTask({
        name: 'テストタスク',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      })

      expect(taskManager.tasks.value.length).toBe(initialCount + 1)
    })

    it('タスク名が空の場合はエラーを投げる', () => {
      expect(() => {
        taskManager.createTask({
          name: '',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-07')
        })
      }).toThrow('タスク名は必須です')
    })

    it('終了日が開始日より前の場合はエラーを投げる', () => {
      expect(() => {
        taskManager.createTask({
          name: 'テストタスク',
          startDate: new Date('2024-01-07'),
          endDate: new Date('2024-01-01')
        })
      }).toThrow('終了日は開始日より後である必要があります')
    })
  })

  describe('タスク取得機能', () => {
    it('IDでタスクを取得できる', () => {
      const createdTask = taskManager.createTask({
        name: 'テストタスク',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      })

      const foundTask = taskManager.getTaskById(createdTask.id)

      expect(foundTask).toEqual(createdTask)
    })

    it('存在しないIDの場合はundefinedを返す', () => {
      const foundTask = taskManager.getTaskById('non-existent-id')

      expect(foundTask).toBeUndefined()
    })

    it('全てのタスクを取得できる', () => {
      const task1 = taskManager.createTask({
        name: 'タスク1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      })

      const task2 = taskManager.createTask({
        name: 'タスク2',
        startDate: new Date('2024-01-08'),
        endDate: new Date('2024-01-14')
      })

      const allTasks = taskManager.tasks.value

      expect(allTasks.find(t => t.id === task1.id)).toBeDefined()
      expect(allTasks.find(t => t.id === task2.id)).toBeDefined()
      expect(allTasks.length).toBeGreaterThanOrEqual(2)
    })
  })
})