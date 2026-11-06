require('dotenv').config();
const app = require('./src/app');

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Sprout Task Manager API listening on port ${port}`));
