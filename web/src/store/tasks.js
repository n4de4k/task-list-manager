import PouchyStore from "pouchy-store";
import Config from "config";

class TaskStore extends PouchyStore {
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

export default new TaskStore();
