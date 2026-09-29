// focuflow/frontend/src/components/TaskCard.jsx
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { CalendarIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline'; // Outline icons

// This is a helper component for the priority tag
const PriorityTag = ({ priority }) => {
  const priorityStyles = {
    low: {
      icon: <StarIcon className="h-4 w-4 mr-1 text-blue-600" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    medium: {
      icon: <StarIcon className="h-4 w-4 mr-1 text-yellow-600" />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    high: {
      icon: <HeartIcon className="h-4 w-4 mr-1 text-red-600" />,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
  };

  const style = priorityStyles[priority] || priorityStyles.medium;

  return (
    <span className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${style.bgColor} ${style.textColor} ${style.borderColor}`}>
      {style.icon}
      {priority}
    </span>
  );
};

const TaskCard = ({ task, index }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    // A simple format, you can use a library like date-fns for more complex needs
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  };
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // --- UPDATED STYLING TO MATCH YOUR DESIGN ---
          className={`bg-white p-4 rounded-lg shadow-md border border-pink-100 mb-3
             cursor-pointer transition-all ease-in-out duration-200
             hover:scale-105 hover:-translate-y-1 hover:shadow-lg
             hover:border-pink-500
             ${snapshot.isDragging ? 'shadow-xl scale-105' : ''}`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Title */}
          <h4 className="font-semibold text-gray-800 text-base">{task.title}</h4>

          {/* Description */}
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          
          {/* Tags Container */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <PriorityTag priority={task.priority} />
            {task.tags?.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-600 border border-purple-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center mt-4 text-gray-400">
              <CalendarIcon className="h-4 w-4 mr-1.5" />
              <span className="text-xs font-medium">{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;