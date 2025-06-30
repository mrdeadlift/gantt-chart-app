import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskManager } from '../useTaskManager'
import type { UpdateTaskInput } from '../../types/task'

describe('useTaskManager - タスク編集・削除機能', () => {
  let taskManager: ReturnType<typeof useTaskManager>

  beforeEach(() => {
    taskManager = useTaskManager()
  })

  describe('タスク編集機能', () => {
    it('既存のタスクを更新できる', () => {
      const createdTask = taskManager.createTask({
        name: '元のタスク',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      })

      const updateInput: UpdateTaskInput = {
        id: createdTask.id,
        name: '更新されたタスク',
        progress: 50,
        description: '更新された説明'
      }

      const updatedTask = taskManager.updateTask(updateInput)

      expect(updatedTask).toBeDefined()
      expect(updatedTask!.name).toBe('更新されたタスク')
      expect(updatedTask!.progress).toBe(50)
      expect(updatedTask!.description).toBe('更新された説明')
      expect(updatedTask!.id).toBe(createdTask.id)
    })

    it('日付を更新できる', () => {
      const createdTask = taskManager.createTask({
        name: 'テストタスク',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      })

      const newStartDate = new Date('2024-01-02')
      const newEndDate = new Date('2024-01-08')

      const updatedTask = taskManager.updateTask({
        id: createdTask.id,
        startDate: newStartDate,
        endDate: newEndDate
      })

      expect(updatedTask!.startDate).toEqual(newStartDate)
      expect(updatedTask!.endDate).toEqual(newEndDate)
    })

    it('存在しないタスクを更新しようとするとnullを返す', () => {
      const result = taskManager.updateTask({
        id: 'non-existent-id',
        name: '更新されたタスク'
      })

      expect(result).toBeNull()
    })

    it('不正な日付範囲で更新しようとするとエラーを投げる', () => {
      const createdTask = taskManager.createTask({
        name: 'テストタスク',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      })

      expect(() => {
        taskManager.updateTask({
          id: createdTask.id,
          startDate: new Date('2024-01-08'),
          endDate: new Date('2024-01-01')
        })
      }).toThrow('終了日は開始日より後である必要があります')
    })

    it('空のタスク名で更新しようとするとエラーを投げる', () => {
      const createdTask = taskManager.createTask({
        name: 'テストタスク',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      })

      expect(() => {
        taskManager.updateTask({
          id: createdTask.id,
          name: ''
        })
      }).toThrow('タスク名は必須です')
    })

    it('無効な進捗率で更新しようとするとエラーを投げる', () => {
      const createdTask = taskManager.createTask({
        name: 'テストタスク',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      })

      expect(() => {
        taskManager.updateTask({
          id: createdTask.id,
          progress: 150
        })
      }).toThrow('進捗率は0-100の範囲で設定してください')

      expect(() => {
        taskManager.updateTask({
          id: createdTask.id,
          progress: -10
        })
      }).toThrow('進捗率は0-100の範囲で設定してください')
    })
  })

  describe('タスク削除機能', () => {
    it('既存のタスクを削除できる', () => {
      const createdTask = taskManager.createTask({
        name: '削除予定のタスク',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      })

      const initialCount = taskManager.tasks.value.length
      const deleted = taskManager.deleteTask(createdTask.id)

      expect(deleted).toBe(true)
      expect(taskManager.tasks.value.length).toBe(initialCount - 1)
      expect(taskManager.getTaskById(createdTask.id)).toBeUndefined()
    })

    it('存在しないタスクを削除しようとするとfalseを返す', () => {
      const deleted = taskManager.deleteTask('non-existent-id')

      expect(deleted).toBe(false)
    })

    it('削除されたタスクへの依存関係がクリーンアップされる', () => {
      const task1 = taskManager.createTask({
        name: 'タスク1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-03')
      })

      const task2 = taskManager.createTask({
        name: 'タスク2',
        startDate: new Date('2024-01-04'),
        endDate: new Date('2024-01-07'),
        dependencies: [task1.id]
      })

      // task1を削除
      taskManager.deleteTask(task1.id)

      // task2の依存関係からtask1が削除されているかチェック
      const updatedTask2 = taskManager.getTaskById(task2.id)
      expect(updatedTask2!.dependencies).not.toContain(task1.id)
      expect(updatedTask2!.dependencies).toEqual([])
    })
  })

  describe('ソート機能', () => {
    it('タスクが開始日順にソートされる', () => {
      const task1 = taskManager.createTask({
        name: 'タスク1',
        startDate: new Date('2024-01-03'),
        endDate: new Date('2024-01-07')
      })

      const task2 = taskManager.createTask({
        name: 'タスク2',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05')
      })

      const task3 = taskManager.createTask({
        name: 'タスク3',
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-06')
      })

      const sortedTasks = taskManager.sortedTasks.value

      expect(sortedTasks[0].id).toBe(task2.id) // 2024-01-01
      expect(sortedTasks[1].id).toBe(task3.id) // 2024-01-02
      expect(sortedTasks[2].id).toBe(task1.id) // 2024-01-03
    })
  })
})