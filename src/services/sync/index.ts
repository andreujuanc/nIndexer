import { BigNumber, ethers } from "ethers";
import { getNextBlock } from "../../data/models/blocks";
import { saveTransactions } from "../../data/models/transactions";
import { beginTransaction, commitTransaction, rollbackTransaction } from "../../data/postgress";
import { syncBlock } from "./syncBlock";

export async function startSync(chainId: number) {
    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.RPC_URL, chainId)
    while (true) {
        const client = await beginTransaction()

        try {
            const nextBlockNumber = await getNextBlock(client)
            if (nextBlockNumber % 100 === 0) {
                const current = await provider.getBlockNumber()
                console.log('ℹ️ Syncing block:', nextBlockNumber, 'of', current, 'out of sync by', current - nextBlockNumber, 'blocks')
            }
            else
                console.log('ℹ️ Syncing block:', nextBlockNumber)

            await syncBlock(client, provider, nextBlockNumber);
            await commitTransaction(client)
        } catch (ex) {
            await rollbackTransaction(client)
            console.error(ex)
            await new Promise(resolve => setTimeout(resolve, 5000))
        }
        finally {
            client.release()
        }
    }
}