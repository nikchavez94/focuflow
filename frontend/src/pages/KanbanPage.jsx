// focuflow/frontend/src/pages/KanbanPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import api from '../services/api';
import KanbanColumn from '../components/KanbanColumn.jsx';
import TaskModal from '../components/TaskModal.jsx';
import './KanbanPage.css';

const KanbanPage = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [ { id: 'todo', title: 'To Do' }, { id: 'inprogress', title: 'In Progress' }, { id: 'done', title: 'Done' } ];

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get(`/projects/${projectId}/tasks`);
      setTasks(response.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Could not load tasks.");
    }
  }, [projectId]);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;
      setLoading(true); setError('');
      try {
        setProjectName(`Project ${projectId}`);
        await fetchTasks();
      } catch (err) {
        console.error("Could not load project data", err);
        setError("Could not load project data.");
      } finally { setLoading(false); }
    };
    fetchProjectData();
  }, [projectId, fetchTasks]);

  const handleCreateTask = async (taskData) => {
    try {
      await api.post(`/projects/${projectId}/tasks`, taskData);
      await fetchTasks();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task. Please try again.");
    }
  };

  // --- THIS IS THE FULLY IMPLEMENTED FUNCTION ---
 // --- THIS IS THE FULLY IMPLEMENTED FUNCTION ---
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    const taskId = draggableId;
    const newStatus = destination.droppableId;
    
    // Keep a copy of the original tasks in case the API call fails
    const originalTasks = [...tasks];

    // Optimistic UI Update
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    // Backend API Call
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status:", err);
      // If it fails, revert the UI to the original state
      setTasks(originalTasks);
      setError("Failed to move task. Please try again.");
    }
  };

  if (loading) return <p>Loading board...</p>;
  
  const getTasksByStatus = (status) =>
  tasks
    .filter(task => task.status === status)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto" style={{ backgroundColor: '#FFF7FB', backgroundImage: 'linear-gradient(#FBCFE8 1px, transparent 1px)', backgroundSize: '100% 1.5rem' }}>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">Priorities</h1>
        <p className="text-gray-500 italic font-cursive text-lg mt-2">"Energy flows, where attention goes."</p>
        <h2 className="text-xl font-semibold text-gray-700 mt-4">Board: {projectName}</h2>
      </div>
      {error && <p className="text-red-500 text-center font-semibold mb-4">{error}</p>}
      <div className="my-6">
        <button onClick={() => setIsModalOpen(true)} className="w-full bg-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors shadow-md">
          + Add New Task
        </button>
      </div>
      {isModalOpen && (
        <TaskModal 
          onSave={handleCreateTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex justify-center gap-6 mt-4">
          {columns.map(column => (
            <KanbanColumn key={column.id} column={column} tasks={getTasksByStatus(column.id)} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
export default KanbanPage;