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

  sortData() {
    return this.data.sort((one, two) => {
      const oneTs = one.createdAt;
      const twoTs = two.createdAt;
      if (oneTs > twoTs) return -1;
      if (oneTs < twoTs) return 1;
      return 0;
    });
  }
}

export default new TaskStore();
