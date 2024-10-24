"use client"
import useTodoStore, { Status, Task as TaskType } from '@/store/store'
import Column from './column'
import NewTodoDialog from './new-todo-dialog'
import { closestCenter, DndContext, DragEndEvent, DragOverEvent, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

export default function Columns() {
    const tasks = useTodoStore((state) => state.tasks)
    const orderTasks = useTodoStore((state) => state.orderTasks)
    const updateTask = useTodoStore((state) => state.updateTask)

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        const oldIndex = tasks.findIndex(task => task.id === active.id)
        const newIndex = tasks.findIndex(task => task.id === over?.id)
        orderTasks(arrayMove(tasks, oldIndex, newIndex))
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (over?.id !== active.id) {
            // Verificamos si el elemento sobre el que estamos es una tarea o una columna
            if (typeof over?.id === 'string' && ['TODO', 'IN_PROGRESS', 'DONE'].includes(over.id)) {
                // Si es una columna, actualizamos el estado de la tarea
                updateTask(active.id.toString(), over.id as Status)
            } else {
                // Si es una tarea, obtenemos su estado y actualizamos la tarea activa
                const overTask = tasks.find(task => task.id === over?.id)
                if (overTask) {
                    updateTask(active.id.toString(), overTask.status)
                }
            }
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    )

    return (
        <div>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                sensors={sensors}
            >
                <NewTodoDialog />

                <section className='mt-10 flex gap-6 lg:gap-12'>
                    <Column title='Todo' status='TODO' data={tasks.filter(task => task.status === 'TODO')} />
                    <Column title='In Progress' status='IN_PROGRESS' data={tasks.filter(task => task.status === 'IN_PROGRESS')} />
                    <Column title='Done' status='DONE' data={tasks.filter(task => task.status === 'DONE')} />
                </section>
            </DndContext>
        </div>
    )
}