// focuflow/frontend/src/pages/CalendarPage.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment'; // DELETE THIS LINE

import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';
import TaskModal from '../components/TaskModal.jsx'; // Add .jsx for clarity

// --- THIS IS THE CORRECTED INITIALIZATION ---
// We require moment here to ensure it's loaded correctly by the build tool.
const localizer = momentLocalizer(require('moment'));

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]); // State for user's projects
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both projects and tasks in parallel for efficiency
      const [projectsResponse, tasksResponse] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks/all') // Use our new endpoint
      ]);

      setProjects(projectsResponse.data);

      const allTasks = tasksResponse.data;
      const formattedEvents = allTasks
        .filter(task => task.dueDate)
        .map(task => ({
          id: task.id,
          title: task.title,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          resource: task,
        }));
      
      setEvents(formattedEvents);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleCreateTask = async (taskData, projectId) => {
    try {
      // The modal gives us the projectId this time
      await api.post(`/projects/${projectId}/tasks`, taskData);
      setIsModalOpen(false);
      fetchData(); // Refresh all data
    } catch(err) {
      console.error("Failed to create task from calendar:", err);
    }
  };

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Calendar</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors"
        >
          + Add Task
        </button>
      </div>
      
      {isModalOpen && (
        <TaskModal
          onSave={handleCreateTask}
          onClose={() => setIsModalOpen(false)}
          projects={projects} // Pass the projects to the modal
        />
      )}

      <div style={{ flexGrow: 1 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default CalendarPage;