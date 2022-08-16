import { loadDatabase, updateDatabase } from './db_updater';

const main = async () => {
  await loadDatabase();
  await updateDatabase();
  setInterval(updateDatabase, 60_000);
};

main().catch(console.error);
