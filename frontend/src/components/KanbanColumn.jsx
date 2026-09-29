// focuflow/frontend/src/components/KanbanColumn.jsx
import React from 'react';
import { Droppable } from 'react-beautiful-dnd'; 
import TaskCard from './TaskCard';

const KanbanColumn = ({ column, tasks }) => {
  return (
    <div className="bg-white rounded-lg w-72 p-6 flex flex-col
             border-2 border-dotted border-fuchsia-400 shadow-sm flex-grow">
      <h2>{column.title}</h2>
      {/* We wrap the tasks container in a Droppable component from the library */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className="tasks-container"
            ref={provided.innerRef} // Connects the DOM element to the library
            {...provided.droppableProps} // Adds necessary props for droppable behavior
            // Use snapshot.isDraggingOver to change bg color when dragging over
            style={{ backgroundColor: snapshot.isDraggingOver ? '#e9e9e9' : 'inherit' }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder} {/* Creates space for the card while dragging */}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;