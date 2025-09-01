import "dotenv/config";
import app from "./src/app";
import { connectDB } from "./src/config";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
