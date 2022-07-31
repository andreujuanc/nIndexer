import { BigNumber, ethers } from "ethers";
import { getNextBlock, saveBlock } from "../../data/models/blocks";
import { saveTransactions } from "../../data/models/transactions";
import { saveLogs } from "../../data/models/logs";
import { beginTransaction, commitTransaction, rollbackTransaction } from "../../data/postgress";

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

export async function startSync() {
    while (true) {
        const client = await beginTransaction()

        try {
            const current = await provider.getBlockNumber()
            const nextBlock = await getNextBlock(client)
            console.log('ℹ️ Syncing block:', nextBlock, 'of', current, 'out of sync by', current - nextBlock, 'blocks')
            
            //const block = await getBlockData(nextBlock)
            // const txs = await Promise.all(block.transactions.map(async (hash) =>
            //     provider.getTransactionReceipt(hash)
            // ))
            const block = await provider.getBlockWithTransactions(nextBlock)
            const txs = block.transactions
            if (txs.length > 0) {
                // await saveTransactions(client, txs.map(x => ({
                //     ...x,
                //     txto: x.to,
                //     txfrom: x.from,
                //     gasUsed: x.gasUsed.toString(),
                //     cumulativeGasUsed: x.cumulativeGasUsed.toString(),
                //     effectiveGasPrice: x.effectiveGasPrice.toString(),
                //     logs: JSON.stringify(x.logs),
                // })))

                // const logs = txs.flatMap(x => x.logs.map(l => ({
                //     ...l,
                //     topics: JSON.stringify(l.topics),
                //     removed: l.removed ?? false
                // })))

                // if (logs.length > 0) {
                //     await saveLogs(client, logs)
                // }
            }

            await saveBlock(client, {
                number: block.number,
                data: block
            })

            await commitTransaction(client)

            //await new Promise(resolve => setTimeout(resolve, 100))
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

function getBlockData(number: number): Promise<ethers.providers.Block> {
    return provider.getBlock(number)
}