import PouchyStore from "pouchy-store";
import Config from "../config";

class TasksAccessor extends PouchyStore {
  get name() {
    return "my_tasks";
  }

  get urlRemote() {
    return Config.POUCH_URL;
  }

  get optionsRemote() {
    return {
      auth: {
        username: Config.POUCH_USERNAME,
        password: Config.POUCH_PASSWORD,
      },
    };
  }
}

export default new TasksAccessor();
