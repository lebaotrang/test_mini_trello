import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import Link from 'next/link'
import { useRouter } from 'next/router'
import Loading from '@/components/common/Loading'
import { detailBoard } from '@/services/boardService'
import dynamic from 'next/dynamic'
import TaskDetail from '@/components/task/TaskDetail'
import { listCards, createCard, deleteCard, updateCardOrder } from '@/services/cardService'
import { createTask } from '@/services/taskService'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import SortableCard from '@/components/card/SortableCard'
import socket from '@/lib/socket'; 

const BoardSidebar = dynamic(() => import('@/components/BoardSidebar'), { ssr: false })
const InviteModal = dynamic(() => import('@/components/InviteModal'), { ssr: false })
const AddCardForm = dynamic(() => import('@/components/card/AddCardForm'), { ssr: false })

export default function BoardView() {
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { id } = router.query
    const [openMenuIndex, setOpenMenuIndex] = useState(null)
    const [openAddCardForm, setOpenAddCardForm] = useState(false)
    const [openAddTaskForm, setOpenAddTaskForm] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [taskTitle, setTaskTitle] = useState('')
    const menuRef = useRef(null)
    const [board, setBoard] = useState({})
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 5, 
        },
      })
    )

    useEffect(() => {
      const handleCardCreated = (newCard) => {
        console.log('cardCreated socket:', newCard);
        setCards((prev) => [...prev, newCard]);
      };

      const handleCardUpdated = (updatedCard) => {
        console.log('cardUpdated socket:', updatedCard);
        setCards((prev) =>
          prev.map((c) => (c.id === updatedCard.id ? { ...c, ...updatedCard } : c))
        );
      };

      const handleCardDeleted = ({ cardId }) => {
        console.log('cardDeleted socket:', cardId);
        setCards((prev) => prev.filter((c) => c.id !== cardId));
      };


      const handleTaskCreated = ({ cardId, task }) => {
        console.log('taskCreated socket:', task);
        setCards((prev) =>
          prev.map((card) =>
            card.id === cardId
              ? { ...card, tasks: [...(card.tasks || []), task] }
              : card
          )
        );
      };

      const handleTaskUpdated = ({ cardId, task }) => {
        console.log('taskUpdated socket:', task);
        setCards((prev) =>
          prev.map((card) => {
            if (card.id !== cardId) return card;
            return {
              ...card,
              tasks: card.tasks
                ? card.tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t))
                : [],
            };
          })
        );
      };

      const handleTaskDeleted = ({ cardId, taskId }) => {
        console.log('taskDeleted socket:', cardId, taskId);
        setCards((prevCards) =>
          prevCards.map((card) => {
            if (card.id === cardId) {
              return {
                ...card,
                tasks: card.tasks.filter((task) => task.id !== taskId),
              };
            }
            return card;
          })
        );
      };

       const handleTasksReordered = ({ cardId, tasksOrder }) => {
        console.log('tasksReordered socket:', cardId, tasksOrder);
        setCards(prevCards =>
          prevCards.map(card => {
            if (card.id === cardId) {

              const newTasks = card.tasks.map(task => ({
                ...task,
                order: tasksOrder.indexOf(task.id),
              }));

              newTasks.sort((a, b) => a.order - b.order);
              return { ...card, tasks: newTasks };
            }
            return card;
          })
        );
      };

      const handleCardsReordered = ({ cardsOrder }) => {
        console.log('cardsReordered socket:', cardsOrder);
        setCards(prevCards => {

          const orderMap = {};
          cardsOrder.forEach((id, index) => {
            orderMap[id] = index;
          });

          const reordered = [...prevCards].map(card => ({
            ...card,
            order: orderMap[card.id] ?? card.order,
          }));

          return reordered.sort((a, b) => a.order - b.order);
        });
      };

      socket.on('cardCreated', handleCardCreated);
      socket.on('cardUpdated', handleCardUpdated);
      socket.on('cardDeleted', handleCardDeleted);
      socket.on('cardsReordered', handleCardsReordered);
      socket.on('taskCreated', handleTaskCreated);
      socket.on('taskUpdated', handleTaskUpdated);
      socket.on('taskDeleted', handleTaskDeleted);
      socket.on('tasksReordered', handleTasksReordered);
      

      return () => {
        socket.off('cardCreated', handleCardCreated);
        socket.off('cardUpdated', handleCardUpdated);
        socket.off('cardDeleted', handleCardDeleted);
        socket.off('cardsReordered', handleCardsReordered);
        socket.off('taskCreated', handleTaskCreated);
        socket.off('taskUpdated', handleTaskUpdated);
        socket.off('taskDeleted', handleTaskDeleted);
        socket.off('tasksReordered', handleTasksReordered);
      };
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuIndex(null)
        }
    }

    useEffect(() => {
        if (id) {
          retrieveAllCards(id)
          retrieveBoard(id)
        }
    }, [id])

    const retrieveBoard = async (boardId) => {
        try {
        const res = await detailBoard(boardId)
        if (res?.status === 200) {
            setBoard(res.data)
        }
        } catch (err) {
        toast.error(err.message || 'Something went wrong')
        } finally {
        setLoading(false)
        }
    }

    const retrieveAllCards = async (boardId) => {
        setLoading(true)
        try {
        const res = await listCards(boardId)
        if (res?.status === 200) {
            setCards(res.data)
        }
        } catch (err) {
        toast.error(err.message || 'Something went wrong')
        } finally {
        setLoading(false)
        }
    }

    const handleAddCard = async () => {
        try {
        const res = await createCard(id, name, description)
        if (res?.status === 201) {
            await retrieveAllCards(id)
            setName('')
            setDescription('')
            setOpenAddCardForm(false)
        }
        } catch (err) {
        toast.error(err.message || 'Error adding card')
        } finally {
        setLoading(false)
        }
    }

    const handleDeleteCard = async (cardId) => {
        if (!window.confirm('Are you sure you want to delete this card?')) return;
        try {
        setLoading(true)
        const res = await deleteCard(id, cardId)
        if (res.status === 200) {
            await retrieveAllCards(id)
            toast.success('Deleted successfully')
        }
        } catch (err) {
        toast.error(err.message || 'Error deleting card')
        } finally {
        setLoading(false)
        }
    }

    const handleAddTask = async (cardId) => {
        try {
        const res = await createTask(id, cardId, taskTitle, 'description')
        if (res?.status === 201) {
            await retrieveAllCards(id)
            setTaskTitle('')
            setOpenAddTaskForm(null)
        }
        } catch (err) {
          toast.error(err.message || 'Error adding task')
        } finally {
          setLoading(false)
        }
    }

    const openTaskDetail = (task) => setSelectedTask(task)
    const closeTaskDetail = () => setSelectedTask(null)
    const toggleMenu = (index) => setOpenMenuIndex(prev => prev === index ? null : index)

    const handleDragEnd = async (event) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const oldIndex = cards.findIndex(card => "card-" + card.id === active.id);
      const newIndex = cards.findIndex(card => "card-" + card.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const prevCards = [...cards]; // bản gốc trước đó
        const updatedCards = arrayMove(cards, oldIndex, newIndex);
        setCards(updatedCards);

        const newOrder = updatedCards.map(card => card.id);
        // console.log(newOrder)
        try {
          await updateCardOrder(id, newOrder); 
        } catch (error) {
          console.error("loi update order", error);
          setCards(prevCards);
          toast.error('Cập nhật thứ tự thất bại. Đã khôi phục thứ tự cũ.');
        } finally {
          setLoading(false)
        }
      }
    };

  const handleCardUpdated = (updatedCard) => {
    setCards((prevCards) =>
      prevCards.map((c) => (c.id === updatedCard.id ? { ...c, ...updatedCard } : c))
    );
  };

  return (
    <div className="row">
      <BoardSidebar board={board} />
      <div className="col-lg-10 col-md-9 col-12 bg-white">
        <div className='row'>
          <div className="col-12 sub-menu">
            <div className='d-flex justify-content-between p-2'>
              <span className='h5'>{board.name}</span>
              <button className="btn btn-sm btn-dark" onClick={() => setShowInviteModal(true)}>Invite</button>
            </div>
          </div>
        </div>

        {showInviteModal && (
          <InviteModal boardId={id} setShowInviteModal={setShowInviteModal} setLoading={setLoading} loading={loading} />
        )}

        <div className="d-flex align-items-start p-3 position-relative" style={{ gap: '1rem', overflowX: 'auto', height: '1000px' }}>
            {loading && <Loading />}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="d-flex gap-2">
                {cards.map((card) => (
                  <SortableContext key={card.id} items={cards.map(card => "card-"+card.id)} strategy={horizontalListSortingStrategy}>
                    <SortableCard
                      key={card.id}
                      card={card}
                      handleCardUpdated={handleCardUpdated}
                      setSelectedCard={setSelectedCard}
                      openTaskDetail={openTaskDetail}
                      openMenuIndex={openMenuIndex}
                      toggleMenu={toggleMenu}
                      menuRef={menuRef}
                      handleDeleteCard={handleDeleteCard}
                      openAddTaskForm={openAddTaskForm}
                      setOpenAddTaskForm={setOpenAddTaskForm}
                      taskTitle={taskTitle}
                      setTaskTitle={setTaskTitle}
                      handleAddTask={handleAddTask}
                    />
                    </SortableContext>
                ))}
              </div>
            </DndContext>

          <div className="d-flex flex-column justify-content-start align-items-start">
            <AddCardForm
              openAddCardForm={openAddCardForm}
              handleAddCard={handleAddCard}
              setOpenAddCardForm={setOpenAddCardForm}
              setName={setName}
              setDescription={setDescription}
              name={name}
              description={description}
            />
          </div>
          { selectedTask && 
            <TaskDetail 
              closeTaskDetail={closeTaskDetail} 
              selectedTask ={selectedTask} 
              setSelectedTask={setSelectedTask} 
              selectedCard={selectedCard} 
              board={board}
            />}
        </div>
      </div>
    </div>
  )
}
