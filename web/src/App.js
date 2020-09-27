import React, { useMemo, useState, useCallback } from "react";
import { v4 as Uuid } from "uuid";
import "./App.css";

import TaskStore from "store/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [updatedTaskID, setUpdatedTaskID] = useState([]);
  const [form, setForm] = useState({});

  const onChangeForm = useCallback(
    (name, value) => {
      setForm({
        ...form,
        [name]: value,
      });
    },
    [form]
  );

  useMemo(async () => {
    if (!TaskStore.isInitialized) {
      await TaskStore.initialize();
    }

    setTasks(TaskStore.sortData());
  }, []);

  const deleteTask = useCallback(
    (id) => async () => {
      const task = tasks[id];
      await TaskStore.deleteItem(task._id);
      const newTask = [...tasks];
      newTask.splice(id, 1);
      setTasks(newTask);
    },
    [tasks]
  );

  const updateTask = useCallback(
    (id) => () => {
      setUpdatedTaskID(id);
    },
    []
  );

  const finishTask = useCallback(
    (id) => async () => {
      const task = tasks[id];
      await TaskStore.editItem(task._id, {
        status: true,
      });

      const newTask = [...tasks];
      newTask[id].status = true;

      setTasks(newTask);
    },
    [tasks]
  );

  const onSave = useCallback(async () => {
    const id = Uuid();
    await TaskStore.addItemWithId(id, {
      ...form,
      tags: form.tags.split(","),
      created_at: new Date(),
      status: false,
    });
  }, [form]);

  const onSync = useCallback(async () => {
    const unsynced = TaskStore.countUnuploadeds();
    if (unsynced === 0) {
      window.alert("No data need to be synced");
      return;
    }
    if (window.confirm(`Are you sure to sync ${unsynced} data?`)) {
      await TaskStore.upload();
      window.alert(`${unsynced} data successfully synced`);
    }
  }, []);

  return (
    <div className="container">
      <div className="sync-container">
        <button className="alert" onClick={onSync}>
          Sync
        </button>
      </div>
      <form onSubmit={onSave}>
        <label>Content</label>
        <input
          name="content"
          onChange={({ target: { name, value } }) => {
            onChangeForm(name, value);
          }}
        />
        <label>Tags</label>
        <input
          name="tags"
          onChange={({ target: { name, value } }) => {
            onChangeForm(name, value);
          }}
        />
        <button type="submit">Simpan</button>
      </form>
      {tasks.map(
        (task, key) =>
          !!task._id && (
            <div key={key} className="task-item">
              <span className="task-content">{task.content}</span>
              <span className="task-tag">
                {task.tags ? task.tags.join(", ") : ""}
              </span>
              <span className="task-created">{task.created_at}</span>
              <span className="task-status">
                {task.status ? "Done" : "In Progress"}
              </span>
              <div className="task-action">
                <button className="delete" onClick={deleteTask(key)}>
                  Delete
                </button>
                {!task.status && (
                  <button className="info" onClick={finishTask(key)}>
                    Finish Task
                  </button>
                )}
                <button onClick={updateTask(key)}>Update</button>
              </div>
            </div>
          )
      )}
    </div>
  );
}

export default App;
