import chai from "chai";
import { v4 as Uuid } from "uuid";
import ChaiAsPromised from "chai-as-promised";

import DataComponent from "../../app/components/dataComponent";
import TasksController from "../../app/controllers/tasks";

const expect = chai.expect;
chai.use(ChaiAsPromised);

describe("Task Controller", () => {
  before(async () => {
    await DataComponent.build();
  });
  it("should create new task", async () => {
    const controller = new TasksController(DataComponent);
    const newData = {
      content: "example of tags",
      tags: "work,routine",
    };

    const res = await controller.store(newData);
    const isNewDataExists = await controller.checkId(res._id);

    expect(isNewDataExists).to.eq(true);
  });

  it("should not update task with missing id", async () => {
    const controller = new TasksController(DataComponent);
    await controller.store({
      content: "example of task update test-1",
      tags: "work,routine",
    });

    const dummID = Uuid();

    await expect(
      controller.update(dummID, {
        content: "example of task updated",
      })
    ).to.be.rejectedWith(`Task with id ${dummID} is not exists`);
  });

  it("should update task", async () => {
    const controller = new TasksController(DataComponent);
    const newTask = await controller.store({
      content: "example of task update test-2",
      tags: "work,routine",
    });

    await expect(
      controller.update(newTask._id, {
        content: "example of task updated",
      })
    ).to.be.not.rejected;
  });

  it("should not delete task with missing id", async () => {
    const controller = new TasksController(DataComponent);
    await controller.store({
      content: "example of task delete test-1",
      tags: "work,routine",
    });

    const dummID = Uuid();

    await expect(controller.delete(dummID)).to.be.rejectedWith(
      `Task with id ${dummID} is not exists`
    );
  });

  it("should delete task", async () => {
    const controller = new TasksController(DataComponent);
    const newTask = await controller.store({
      content: "example of task delete test 2",
      tags: "work,routine",
    });

    await expect(controller.delete(newTask._id)).to.be.not.rejected;
  });

  it("should sync task", async () => {
    const controller = new TasksController(DataComponent);
    await controller.store({
      content: "example of task sync task",
      tags: "work",
    });

    expect(controller.countUnsynced()).to.greaterThan(0);

    await controller.sync();

    expect(controller.countUnsynced()).to.eq(0);
  });
});
