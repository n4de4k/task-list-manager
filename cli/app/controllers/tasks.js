import { v4 as Uuid } from "uuid";

class TaskController {
  constructor(dataComponent) {
    this.taskAccessor = dataComponent.taskAccessor;
  }

  async store({ content, tags: tagsStr }) {
    if (!content) {
      throw new Error("Task content is required");
    }
    if (!tagsStr) {
      throw new Error("tags required to create new tasks, e.g: work,routine");
    }

    const tags = tagsStr.split(",");
    const newID = Uuid();
    const newData = {
      content,
      tags,
      created_at: new Date(),
    };
    await this.taskAccessor.addItemWithId(newID, newData);

    return {
      _id: newID,
      ...newData,
    };
  }

  async update(id, newData) {
    const isExists = await this.taskAccessor.checkIdExist(id);
    if (!isExists) {
      throw new Error(`Task with id ${id} is not exists`);
    }

    await this.taskAccessor.editItem(id, newData);
  }

  async delete(id) {
    const isExists = await this.taskAccessor.checkIdExist(id);
    if (!isExists) {
      throw new Error(`Task with id ${id} is not exists`);
    }

    await this.taskAccessor.deleteItem(id);
  }

  getAllTask() {
    return this.taskAccessor.data;
  }

  getOneTask(id) {
    const task = (this.taskAccessor.data || []).find((item) => item._id === id);

    return task;
  }

  checkId(id) {
    return this.taskAccessor.checkIdExist(id);
  }

  countUnsynced() {
    return this.taskAccessor.countUnuploadeds();
  }

  async sync() {
    await this.taskAccessor.upload();
  }
}

export default TaskController;
