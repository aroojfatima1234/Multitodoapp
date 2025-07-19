import { useEffect, useState } from 'react';
import {
  Form, FormGroup, Label, Input, Button, Card, CardBody, CardTitle,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { Plus, Minus, Pencil, Trash2 } from 'lucide-react';
import './App.css';

function App() {
  const [listTitle, setListTitle] = useState('');
  const [tasks, setTasks] = useState(['']);
  const [allLists, setAllLists] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTasks, setEditTasks] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('multiTodoLists');
    if (data) setAllLists(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('multiTodoLists', JSON.stringify(allLists));
  }, [allLists]);

  const handleTaskChange = (value, index) => {
    const updated = [...tasks];
    updated[index] = value;
    setTasks(updated);
  };

  const addTaskField = () => setTasks([...tasks, '']);

  const removeTaskField = (index) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  const handleAddList = () => {
    if (!listTitle.trim() || tasks.some(task => !task.trim())) {
      alert('Please provide a title and fill all task fields.');
      return;
    }
    setAllLists([...allLists, { title: listTitle, tasks }]);
    setListTitle('');
    setTasks(['']);
  };

  const openEditModal = (index) => {
    setEditIndex(index);
    setEditTitle(allLists[index].title);
    setEditTasks([...allLists[index].tasks]);
    setModalOpen(true);
  };

  const handleEditTaskChange = (value, index) => {
    const updated = [...editTasks];
    updated[index] = value;
    setEditTasks(updated);
  };

  const addEditTaskField = () => setEditTasks([...editTasks, '']);

  const removeEditTaskField = (index) => {
    const updated = [...editTasks];
    updated.splice(index, 1);
    setEditTasks(updated);
  };

  const saveChanges = () => {
    if (!editTitle.trim() || editTasks.some(task => !task.trim())) {
      alert('Title and tasks in edit modal cannot be empty.');
      return;
    }
    const updatedLists = [...allLists];
    updatedLists[editIndex] = { title: editTitle, tasks: editTasks };
    setAllLists(updatedLists);
    setModalOpen(false);
  };

  const deleteList = (index) => {
    const updated = [...allLists];
    updated.splice(index, 1);
    setAllLists(updated);
  };

  return (
    <div className="app-wrapper">
      {/* FORM CARD */}
      <div className="content-wrapper">
        <div className="form-card">
          <CardBody>
            <CardTitle tag="h2" className="text-center mb-4" style={{ fontWeight: '600', color: '#38bdf8' }}>
              Multi Todo App
            </CardTitle>
            <Form>
              <FormGroup>
                <Label for="listTitle">Title of List</Label>
                <Input
                  type="text"
                  id="listTitle"
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                />
              </FormGroup>

              <Label>Tasks of List</Label>
              {tasks.map((task, index) => (
                <FormGroup key={index} className="d-flex mb-2 align-items-center">
                  <Input
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskChange(e.target.value, index)}
                  />
                  {index === tasks.length - 1 ? (
                    <>
                      <Button color="primary" className="ms-2" onClick={addTaskField}>
                        <Plus size={18} />
                      </Button>
                      {tasks.length > 1 && (
                        <Button color="danger" className="ms-1" onClick={() => removeTaskField(index)}>
                          <Minus size={18} />
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button color="danger" className="ms-2" onClick={() => removeTaskField(index)}>
                      <Minus size={18} />
                    </Button>
                  )}
                </FormGroup>
              ))}
              <Button color="success" onClick={handleAddList}>Add List</Button>
            </Form>
          </CardBody>
        </div>

        {/* LIST SECTION */}
        <div className="task-lists">
          {allLists.map((list, idx) => (
            <Card className="mb-3" key={idx}>
              <CardBody>
                <h5>{idx}: {list.title}</h5>
                <ul className="mt-2">
                  {list.tasks.map((task, i) => (
                    <li key={i}>{i}: {task}</li>
                  ))}
                </ul>
                <div className="todo-buttons mt-2 d-flex gap-2">
                  <Button color="success" onClick={() => openEditModal(idx)}>
                    <Pencil size={16} />
                  </Button>
                  <Button color="warning" onClick={() => deleteList(idx)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* MODAL */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
          <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
            Update your Tasks
          </ModalHeader>
          <ModalBody>
            <Input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mb-3"
            />
            {editTasks.map((task, i) => (
              <FormGroup key={i} className="d-flex mb-2 align-items-center">
                <Input
                  value={task}
                  onChange={(e) => handleEditTaskChange(e.target.value, i)}
                />
                <Button color="danger" className="ms-2" onClick={() => removeEditTaskField(i)}>
                  <Minus size={18} />
                </Button>
              </FormGroup>
            ))}
            <Button color="primary" onClick={addEditTaskField}>
              <Plus size={18} />
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={saveChanges}>Update</Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default App;
