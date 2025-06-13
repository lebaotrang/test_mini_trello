import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import dynamic from 'next/dynamic'
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import SortableTask from '@/components/task/SortableTask';
import { updateTaskOrder } from '@/services/taskService'
import { updateCard } from '@/services/cardService'
const AddTaskForm = dynamic(() => import('@/components/task/AddTaskForm'), { ssr: false });
const CardTitle = dynamic(() => import('@/components/card/CardTitle'), { ssr: false });

export default function SortableCard({
    card,
    handleCardUpdated,
    openMenuIndex,
    openTaskDetail,
    setSelectedCard,
    toggleMenu,
    menuRef,
    handleDeleteCard,
    openAddTaskForm,
    setOpenAddTaskForm,
    taskTitle,
    setTaskTitle,
    handleAddTask,
    // updateTasksOrder, // tạm thời chưa dùng
    }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: "card-"+card.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        minWidth: '250px',
        width: '250px'
    }

    const [tasks, setTasks] = useState(card.tasks);

    // Khi card.tasks từ props thay đổi, cập nhật lại local state
    useEffect(() => {
        setTasks(card.tasks);
    }, [card.tasks]);

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = tasks.findIndex(task => "task-"+task.id === active.id);
            const newIndex = tasks.findIndex(task => "task-"+task.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const prevTasks = [...tasks]; // bản gốc trước đó
                const updatedTasks = arrayMove(tasks, oldIndex, newIndex);
                setTasks(updatedTasks);
        
                const newOrder = updatedTasks.map(task => task.id);
                try {
                    await updateTaskOrder(card.boardId, card.id, newOrder); 
                } catch (error) {
                    console.error("loi update order", error);
                    setCards(prevTasks);;
                } finally {
                //   setLoading(false)
                }
            }
        }
    };

    const handleEditCard = async (card, name) => {
        try {
            const res = await updateCard(card.boardId, card.id, { name }); 
            if (res && res.status == 200) {
                const updatedCard = res.data;
                handleCardUpdated?.(updatedCard);
            }
        } catch (error) {
            console.error("loi update order", error);
        } finally {
            //   setLoading(false)
        }
    }
    
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div key={card.id} className="card" style={{ width: '250px', minWidth: '250px', 'zIndex': '0'}}>

                <CardTitle
                    card={card}
                    openMenuIndex={openMenuIndex}
                    toggleMenu={toggleMenu}
                    handleDeleteCard={handleDeleteCard}
                    handleEditCard={handleEditCard}
                />

                <div className="card-body d-flex flex-column gap-2 bg-dark">
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                        <SortableContext
                            items={tasks?.map(t => "task-"+t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {tasks?.map(task => (
                                <SortableTask key={task.id} task={task} openTaskDetail={openTaskDetail} card={card} setSelectedCard={setSelectedCard}/>
                            ))}
                        </SortableContext>
                    </DndContext>

                    <AddTaskForm
                        openAddTaskForm={openAddTaskForm}
                        card={card}
                        taskTitle={taskTitle}
                        setTaskTitle={setTaskTitle}
                        handleAddTask={handleAddTask}
                        setOpenAddTaskForm={setOpenAddTaskForm}
                    />
                </div>
            </div>
        </div>
    )
}
