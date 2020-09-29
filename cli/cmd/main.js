import yargs from "yargs";
import Inquirer from "inquirer";
import moment from "moment";

import DataComponent from "../app/components/dataComponent";
import TaskController from "../app/controllers/tasks";

const options = yargs
  .usage("Usage: -<option> <option value>")
  .option("l", {
    alias: "list",
    describe: "List All Task",
    type: "string",
  })
  .option("c", {
    alias: "create",
    describe: "Create New Task",
    type: "string",
  })
  .option("t", {
    alias: "tags",
    describe: "Set Task Tag",
    type: "string",
  })
  .option("u", {
    alias: "update",
    describe: "Update task data",
    type: "string",
  })
  .option("d", {
    alias: "delete",
    describe: "Delete task data",
    type: "string",
  })
  .option("s", {
    alias: "sync",
    describe: "Sync task data to cloud",
    type: "string",
  }).argv;

const run = async () => {
  await DataComponent.build();
  const taskController = new TaskController(DataComponent);

  if (options.list !== undefined) {
    const tasks = taskController.getAllTask();
    const display = tasks
      .map(
        (task, id) =>
          `${task.content} \nTag: ${task.tags.join(
            ", "
          )})\nCreated At: ${moment(task.created_at).format(
            "YYYY-MM-DD HH:mm:ss"
          )}`
      )
      .join("\n\n");
    console.log("List all of your task:");
    console.log(display);
  } else if (options.create !== undefined) {
    const res = await taskController.store({
      content: options.create,
      tags: options.tags,
    });

    console.log(`New Task created with id ${res._id}`);
  } else if (options.update !== undefined) {
    const tasks = taskController.getAllTask();
    const choices = tasks.map(
      (task, id) => `${id} - ${task.content} (${task.tags.join(", ")})`
    );
    const answers = await Inquirer.prompt([
      {
        type: "list",
        name: "update_task_id",
        message: "Choose task you want to update?",
        choices,
      },
      {
        name: "new_content",
        message:
          "What is the new content of the task? (leave blank if you do not want to change)",
      },
      {
        name: "new_tags",
        message:
          "What is the new tags of the task? (leave blank if you do not want to change)",
      },
    ]);

    const chosenID = answers.update_task_id.split(" - ")[0];
    const { _id: chosenTaskID } = tasks[Number(chosenID)];

    const newData = {};
    if (!!answers.new_content) {
      newData.content = answers.new_content;
    }
    if (!!answers.new_tags) {
      newData.tags = answers.new_tags;
    }

    await taskController.update(chosenTaskID, newData);
    console.log(`Task with id ${chosenTaskID} updated`);
  } else if (options.delete !== undefined) {
    const tasks = taskController.getAllTask();
    const choices = tasks.map(
      (task, id) => `${id} - ${task.content} (${task.tags.join(", ")})`
    );
    const answers = await Inquirer.prompt([
      {
        type: "list",
        name: "delete_task_id",
        message: "Choose task you want to delete?",
        choices,
      },
    ]);

    const chosenID = answers.delete_task_id.split(" - ")[0];
    const { _id: chosenTaskID } = tasks[Number(chosenID)];

    await taskController.delete(chosenTaskID);
    console.log(`Task with id ${chosenTaskID} deleted`);
  } else if (options.sync !== undefined) {
    const unsyncedAmount = taskController.countUnsynced();
    if (unsyncedAmount === 0) {
      throw new Error("No data need to be synced");
    }
    const answers = await Inquirer.prompt([
      {
        name: "confirmation",
        message: `Are you sure to sync ${unsyncedAmount} data? [y/n]`,
        default: "n",
      },
    ]);

    if (answers.confirmation.toLowerCase() === "y") {
      await taskController.sync();
    }

    console.log(`${unsyncedAmount} data successfully synced`);
  }
};

run()
  .catch((err) => {
    console.log("Cant execute the request, because", err.message);
    console.log(err.stack);
  })
  .finally(() => {
    process.exit();
  });
