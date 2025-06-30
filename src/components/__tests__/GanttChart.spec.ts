import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GanttChart from '../GanttChart.vue'
import type { Task } from '../../types/task'

describe('GanttChart', () => {
  const mockTasks: Task[] = [
    {
      id: 'task-1',
      name: 'タスク1',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-05'),
      progress: 50,
      dependencies: []
    },
    {
      id: 'task-2',
      name: 'タスク2',
      startDate: new Date('2024-01-03'),
      endDate: new Date('2024-01-07'),
      progress: 25,
      dependencies: ['task-1']
    },
    {
      id: 'task-3',
      name: 'タスク3',
      startDate: new Date('2024-01-06'),
      endDate: new Date('2024-01-10'),
      progress: 0,
      dependencies: []
    }
  ]

  describe('基本的な表示機能', () => {
    it('コンポーネントが正常にマウントされる', () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('すべてのタスクが表示される', () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      const taskElements = wrapper.findAll('[data-testid^="task-"]')
      expect(taskElements).toHaveLength(3)
    })

    it('タスク名が正しく表示される', () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      expect(wrapper.text()).toContain('タスク1')
      expect(wrapper.text()).toContain('タスク2')
      expect(wrapper.text()).toContain('タスク3')
    })

    it('タスクのプログレスが表示される', () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      const task1Progress = wrapper.find('[data-testid="task-task-1-progress"]')
      expect(task1Progress.exists()).toBe(true)
    })
  })

  describe('日付軸の表示', () => {
    it('日付ヘッダーが表示される', () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      const dateHeader = wrapper.find('[data-testid="date-header"]')
      expect(dateHeader.exists()).toBe(true)
    })

    it('指定した期間の日付が表示される', () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-03')
        }
      })

      const dateElements = wrapper.findAll('[data-testid^="date-"]')
      expect(dateElements.length).toBeGreaterThan(0)
    })
  })

  describe('タスクバーの表示', () => {
    it('タスクバーが正しい位置に表示される', () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      const taskBar = wrapper.find('[data-testid="task-task-1-bar"]')
      expect(taskBar.exists()).toBe(true)
    })

    it('タスクバーの幅が期間に応じて設定される', () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      const taskBar = wrapper.find('[data-testid="task-task-1-bar"]')
      const style = taskBar.attributes('style')
      expect(style).toContain('width')
    })

    it('進捗率に応じて進捗バーが表示される', () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      const progressBar = wrapper.find('[data-testid="task-task-1-progress"]')
      const style = progressBar.attributes('style')
      expect(style).toContain('width')
    })
  })

  describe('空のタスクリストの処理', () => {
    it('タスクが空の場合でもエラーにならない', () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: [],
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      expect(wrapper.exists()).toBe(true)
      const taskElements = wrapper.findAll('[data-testid^="task-"]')
      expect(taskElements).toHaveLength(0)
    })
  })

  describe('イベントハンドリング', () => {
    it('タスククリック時にイベントが発生する', async () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      const taskElement = wrapper.find('[data-testid="task-task-1"]')
      await taskElement.trigger('click')

      expect(wrapper.emitted('task-click')).toBeTruthy()
      expect(wrapper.emitted('task-click')?.[0]).toEqual([mockTasks[0]])
    })

    it('タスクバークリック時にイベントが発生する', async () => {
      const wrapper = mount(GanttChart, {
        props: {
          tasks: mockTasks,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10')
        }
      })

      const taskBar = wrapper.find('[data-testid="task-task-1-bar"]')
      await taskBar.trigger('click')

      expect(wrapper.emitted('task-bar-click')).toBeTruthy()
      expect(wrapper.emitted('task-bar-click')?.[0]).toEqual([mockTasks[0]])
    })
  })
})