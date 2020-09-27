import React, { useMemo, useState, useCallback } from "react";
import { v4 as Uuid } from "uuid";
import "./App.css";

import TaskStore from "store/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [updatedTaskID, setUpdatedTaskID] = useState(null);
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

  const onRefresh = useCallback(async () => {
    if (!TaskStore.isInitialized) {
      await TaskStore.initialize();
    }

    setTasks(
      TaskStore.sortData().map((item) => {
        item.isSynced = TaskStore.checkIsUploaded({
          _id: item._id,
        });

        return item;
      })
    );
  }, []);
  useMemo(() => {
    onRefresh();
  }, [onRefresh]);

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
      const task = tasks[id];
      setUpdatedTaskID(id);
      setForm({
        content: task.content,
        tags: task.tags.join(","),
      });
    },
    [tasks]
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

  const onSave = useCallback(
    async (e) => {
      e.preventDefault();
      if (updatedTaskID === null) {
        const id = Uuid();
        const newData = {
          ...form,
          tags: form.tags.split(","),
          created_at: new Date(),
          status: false,
        };

        await TaskStore.addItemWithId(id, newData);

        setTasks([
          {
            ...newData,
            _id: id,
          },
          ...tasks,
        ]);
      } else {
        const task = tasks[updatedTaskID];
        const updateData = {
          ...form,
          tags: form.tags.split(","),
        };
        await TaskStore.editItem(task._id, updateData);

        const newTask = [...tasks];
        newTask[updatedTaskID] = {
          ...newTask[updatedTaskID],
          ...updateData,
        };

        setTasks(newTask);
      }
      setForm({});
    },
    [form, tasks, updatedTaskID]
  );

  const onSync = useCallback(async () => {
    const unsynced = TaskStore.countUnuploadeds();
    if (unsynced === 0) {
      window.alert("No data need to be synced");
      return;
    }
    if (window.confirm(`Are you sure to sync ${unsynced} data?`)) {
      await TaskStore.upload();
      setTasks([
        ...tasks.map((task) => ({
          ...task,
          isSynced: true,
        })),
      ]);
      window.alert(`${unsynced} data successfully synced`);
    }
  }, [tasks]);

  return (
    <div className="container">
      <div className="sync-container">
        <button className="alert" onClick={onSync}>
          Sync
        </button>
      </div>
      <form onSubmit={onSave}>
        {updatedTaskID !== null && (
          <label>Update Task with ID: {tasks[updatedTaskID]._id}</label>
        )}
        <label>Content</label>
        <input
          name="content"
          onChange={({ target: { name, value } }) => {
            onChangeForm(name, value);
          }}
          value={form.content}
        />
        <label>Tags</label>
        <input
          name="tags"
          value={form.tags}
          onChange={({ target: { name, value } }) => {
            onChangeForm(name, value);
          }}
        />
        <button type="submit">Simpan</button>
      </form>
      {tasks.map((task, key) => {
        if (!!task._id) {
          return (
            <div key={key} className="task-item">
              <span className="task-content">{task.content}</span>
              <span className="task-tag">
                Tag: {task.tags ? task.tags.join(", ") : ""}
              </span>
              <span className="task-created">
                {new Date(task.created_at).toLocaleString()}
              </span>
              <div>
                <span
                  className={`task-status ${
                    task.isSynced ? "done" : "not-done"
                  }`}
                >
                  {task.isSynced ? "Synced" : "Not Synced"}
                </span>
                ,
                <span
                  className={`task-status ${task.status ? "done" : "not-done"}`}
                >
                  {task.status ? "Done" : "In Progress"}
                </span>
              </div>
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
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}

export default App;
