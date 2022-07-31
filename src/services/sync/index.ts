import { BigNumber, ethers } from "ethers";
import { getNextBlock, saveBlock } from "../../data/models/blocks";
import { saveTransactions } from "../../data/models/transactions";
import { saveLogs } from "../../data/models/logs";
import { beginTransaction, commitTransaction, rollbackTransaction } from "../../data/postgress";



export async function startSync(chainId: number) {
    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.RPC_URL, chainId)
    while (true) {
        const client = await beginTransaction()

        try {

            const nextBlock = await getNextBlock(client)
            if (nextBlock % 100 === 0) {
                const current = await provider.getBlockNumber()
                console.log('ℹ️ Syncing block:', nextBlock, 'of', current, 'out of sync by', current - nextBlock, 'blocks')
            }
            else
                console.log('ℹ️ Syncing block:', nextBlock)
            const block = await provider.getBlock(nextBlock)
            // const txs = await Promise.all(block.transactions.map(async (hash) =>
            //     provider.getTransactionReceipt(hash)
            // ))
            // const block = await provider.getBlockWithTransactions(nextBlock)
            // const txs = block.transactions
            const logs = await provider.getLogs({ fromBlock: nextBlock, toBlock: nextBlock })


            // if (txs.length > 0) {
            // await saveTransactions(client, txs.map(x => ({
            //     ...x,
            //     txto: x.to,
            //     txfrom: x.from,
            //     gasUsed: x.gasUsed.toString(),
            //     cumulativeGasUsed: x.cumulativeGasUsed.toString(),
            //     effectiveGasPrice: x.effectiveGasPrice.toString(),
            // })))

            // const logs = txs.flatMap(x => x.logs.map(l => ({
            //     ...l,
            //     topics: JSON.stringify(l.topics),
            //     removed: l.removed ?? false
            // })))

            if (logs.length > 0) {
                await saveLogs(client, logs.flatMap(log => ({
                    ...log,
                    topics: JSON.stringify(log.topics),
                    removed: log.removed ?? false
                })))
            }
            //}

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