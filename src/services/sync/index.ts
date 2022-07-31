import { BigNumber, ethers } from "ethers";
import { getNextBlock, saveBlock, saveTransactions } from "../../data/postgress";

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

export async function startSync() {
    while (true) {
        try {
            const nextBlock = await getNextBlock()
            console.log('ℹ️ Syncing block:', nextBlock)
            const block = await getBlockData(nextBlock)
            const txs = await Promise.all(block.transactions.slice(0, 2).map(async (hash) =>
                provider.getTransactionReceipt(hash)
            ))

            if (txs.length > 0) {
                await saveTransactions(txs.map(x => ({
                    hash: x.transactionHash,
                    data: x
                })))
            }

            await saveBlock({
                number: block.number,
                data: block
            })
            //console.log('tx', txs[0])

            await new Promise(resolve => setTimeout(resolve, 100))
        } catch (ex) {
            console.error(ex)
            await new Promise(resolve => setTimeout(resolve, 5000))
        }
    }
}

function getBlockData(number: number): Promise<ethers.providers.Block> {
    return provider.getBlock(number)
}