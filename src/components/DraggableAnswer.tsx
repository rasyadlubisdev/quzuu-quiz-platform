import React from "react"
import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd"

const initialAnswers = [
  { id: "1", content: "int = 5000;" },
  { id: "2", content: "jeruk = 2000;" },
  { id: "3", content: "int anggur = 1500;" },
]

const DraggableAnser: React.FC = () => {
  const [answers, setAnswers] = React.useState(initialAnswers)

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(answers)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setAnswers(items)
  }
  console.log("CHECK", answers)

  return (
    <div className="p-5 bg-gray-800 rounded-lg">
      <p className="text-white mb-3">Lengkapi kode program di bawah ini:</p>
      <div className="bg-black text-white p-4 rounded-lg mb-4">
        <pre>
          {`int apel = 5000;
[________]
int anggur = 1500;
total_harga = apel + jeruk + anggur;`}
        </pre>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div
              className="flex h-44 w-full"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <h2 className="text-white">I am a droppable!</h2>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="answers">
          {(provided) => (
            <div
              className="flex space-x-4"
              id="drag-here"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* {answers.map(({ id, content }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-blue-600 text-white p-2 rounded-lg"
                    >
                      {content}
                    </div>
                  )}
                </Draggable>
              ))} */}
              <Draggable draggableId="draggable-1" index={0}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <h4 className="text-white">My draggable</h4>
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default DraggableAnser
