// Resets the data file to the seed campaigns. Restart a running dev server
// afterwards, since it keeps the data in memory.
import { seedCampaigns } from "../src/server/seed-data";
import { dataFilePath, writeDataFile } from "../src/server/store";

const path = dataFilePath();
const campaigns = seedCampaigns();
writeDataFile(path, campaigns);
console.log(`Wrote ${campaigns.length} campaigns to ${path}`);
