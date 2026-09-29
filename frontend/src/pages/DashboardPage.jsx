// focuflow/frontend/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  // Create project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      setError('Project name cannot be empty.');
      return;
    }
    try {
      await api.post('/projects', { name: newProjectName });
      setNewProjectName('');
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('Failed to create project. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <div className="w-full max-w-3xl px-6 py-10 text-center">
        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-800 mb-3">Dashboard</h1>
        <p className="text-gray-600">
          Welcome, {user ? user.displayName || user.email : 'Guest'}!
        </p>

        <hr className="my-6 w-3/4 mx-auto border-gray-300" />

        {/* Projects */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">My Projects</h2>
        {loading && <p className="text-gray-500">Loading projects...</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <ul className="space-y-2">
          {projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.id}>
                <Link
                  to={`/projects/${project.id}`}
                  className="relative inline-block text-lg font-semibold text-gray-700
                             transition-colors duration-300 hover:text-pink-600
                             after:content-[''] after:absolute after:left-0 after:-bottom-0.5
                             after:h-[2px] after:w-0 after:bg-pink-500
                             after:transition-[width] after:duration-300
                             hover:after:w-full"
                >
                  {project.name}
                </Link>
              </li>
            ))
          ) : (
            !loading && (
              <p className="text-gray-500">
                You don't have any projects yet. Create one below!
              </p>
            )
          )}
        </ul>

        <hr className="my-6 w-3/4 mx-auto border-gray-300" />

        {/* Create Project */}
        <h3 className="text-4xl font-bold text-gray-800 mb-4">
          Create a New Project
        </h3>
        <form onSubmit={handleCreateProject} className="flex items-center justify-center gap-3">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Enter new project name"
            className="border border-gray-300 rounded-lg p-2 w-72 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            className="bg-pink-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
