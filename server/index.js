import "dotenv/config";

import app from "./app.js";
import connectDB from "./data/database.js";

const PORT = process.env.PORT || 8080;

await connectDB();

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
