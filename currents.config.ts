import { CurrentsConfig } from "@currents/playwright";

const config: CurrentsConfig = {
    projectId: "wzCT4R",
    recordKey: process.env.CURRENTS_RECORD_KEY!
};

export default config;