import TaskAccessor from "../accessor/tasks";

class DataComponent {
  async build() {
    const taskAccessor = TaskAccessor;
    await taskAccessor.initialize();
    this.taskAccessor = taskAccessor;
  }
}

export default new DataComponent();
