import { create } from "zustand"
import { v4 as uuid } from 'uuid';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type Task = {
    id: string
    title: string
    description?: string
    status: Status
}

export type State = {
    tasks: Task[]
    draggedTask: string | null
}

export type Actions = {
    addTask: (title: string, description?: string) => void
    removeTask: (id: string) => void
    orderTasks: (tasks: Task[]) => void
    updateTask: (id: string, status: Status) => void
}

const useTodoStore = create<State & Actions>()((set) => ({
    tasks: [],
    draggedTask: null,
    addTask: (title: string, description?: string) => set(state => ({ tasks: [...state.tasks, { id: uuid(), title, description, status: 'TODO' }] })),
    removeTask: (id: string) => {
        console.log('removeTask', id)
        set(state => ({ tasks: state.tasks.filter(task => task.id !== id) }))
    },
    orderTasks: (tasks: Task[]) => set({ tasks }),
    updateTask: (id: string, status: Status) => set(state => ({ tasks: state.tasks.map(task => task.id === id ? { ...task, status } : task) }))
}))

export default useTodoStore