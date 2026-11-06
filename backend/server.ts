import 'dotenv/config';
import { validateEnvironment } from './src/config/env';
import app from './src/app';

validateEnvironment();
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Sprout Task Manager API listening on port ${port}`));
