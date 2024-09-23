import { app } from '@/app';
import { env } from '@/env';

const PORT = env.PORT;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

