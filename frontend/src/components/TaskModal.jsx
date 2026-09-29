import React, { useState } from 'react';

// The component now accepts an optional 'projects' prop
const TaskModal = ({ onSave, onClose, projects }) => {
  // State for all the form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  // New state for the selected project. Default to the first project if the list is provided.
  const [projectId, setProjectId] = useState(projects?.[0]?.id || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      priority,
      dueDate,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean), // .filter(Boolean) removes empty strings
      status: 'todo',
    };
    // The onSave function now also passes the projectId, which is needed by the CalendarPage
    onSave(taskData, projectId);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Task</h2>
        <form onSubmit={handleSubmit}>
          
          {/* --- NEW: Conditionally Rendered Project Selection Dropdown --- */}
          {/* This block will only appear if the 'projects' prop is passed and has items */}
          {projects && projects.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="project">
                Project
              </label>
              <select 
                id="project"
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Title</label>
            <input
              type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Description</label>
            <textarea
              id="description" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              rows={3}
            ></textarea>
          </div>

          {/* Priority Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Priority</label>
            <select 
              value={priority} onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="dueDate">Due Date</label>
            <input
              type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Tags Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;