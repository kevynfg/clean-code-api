import app from "./config/app";
const port = process.env.PORT || 5050;
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
