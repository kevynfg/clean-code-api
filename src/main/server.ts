import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import env from "./config/env";

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import("./config/app")).default;
    const port = env.port;
    app.listen(port, () =>
      console.log(`Server running at http://localhost:${port}`)
    );
  })
  .catch(console.error);
