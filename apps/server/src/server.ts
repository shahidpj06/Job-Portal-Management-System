import "dotenv/config";
import { application } from "./app.js";

const port = Number(process.env.PORT ?? 4000);

application.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});