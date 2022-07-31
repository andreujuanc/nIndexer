import { config } from 'dotenv'
config()

import { connectToPostgress } from "./data/postgress";
import { startSync } from "./services/sync";

async function main() {
    console.clear()
    console.log('🟢 STARTING SERVICES')
    await connectToPostgress()
    const chainId = parseInt(process.env.CHAIN_ID ?? '1')
    console.log('🔗 CHAIN ID:', chainId)
    await startSync(chainId)
}

async function exitHandler(options: any, exitCode: number) {
    if (options.cleanup) {
        console.log('bye');
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null, { cleanup: true }));

main()