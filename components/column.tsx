'use client'

import { Status, Task as TaskType } from "@/store/store"
import Task from "./task"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"

export default function Column({
    title,
    status,
    data
}: {
    title: string
    status: Status,
    data: TaskType[]
}) {
    const { setNodeRef } = useDroppable({
        id: status,
    })

    return (
        <section className='h-[600px] flex-1'>
            <h2 className='ml-1 font-serif text-2xl font-semibold'>{title}</h2>

            <div
                className='mt-3.5 h-full w-full rounded-xl bg-gray-700/50 p-4'
                ref={setNodeRef}
            >
                <SortableContext
                    items={data}
                    strategy={verticalListSortingStrategy}
                >
                    <div className='flex flex-col gap-4'>
                        {data.map(task => (
                            <Task key={task.id} {...task} />
                        ))}

                        {data.length === 0 && status === 'TODO' && (
                            <div className='mt-8 text-center text-sm text-gray-500' id="no-drag">
                                <p id="no-drag">Create a new task</p>
                            </div>
                        )}

                        {data.length === 0 && status !== 'TODO' && (
                            <div className='mt-8 text-center text-sm text-gray-500' id="no-drag">
                                <p id="no-drag">Drag your tasks heres</p>
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>
        </section>
    )
}