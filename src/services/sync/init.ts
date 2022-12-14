import { ethers } from "ethers"
import { getEarliestGapInBlocks, getNextBlock } from "../../data/models/blocks"
import { beginTransaction, commitTransaction, rollbackTransaction } from "../../data/postgress"
import { syncBlock } from "./syncBlock"

export async function initDB(chainId: number) {
    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.RPC_URL, chainId)
    const current = await provider.getBlockNumber()
    while (true) {
        const client = await beginTransaction()

        try {
            const firstBlock = await getEarliestGapInBlocks(client)
            const nextBlock = await getNextBlock(client)
            const batchSize = 80
            let startNumber = 0
            if (firstBlock === null) {
                startNumber = parseInt(process.env.BLOCK_START_AT ?? "0")
            }
            else if (firstBlock > 10_000_000) {
                startNumber = firstBlock - batchSize
            }
            else if (nextBlock < current * 0.8) {
                startNumber = nextBlock
            }
            else {
                console.info('đĸ DB is up to date')
                break;
            }
            const blocksToSync = [...Array(batchSize)].map((_, i) => startNumber + i)
            console.log('đ Syncing blocks. From', blocksToSync[0], 'to', blocksToSync[blocksToSync.length - 1])
            await Promise.all(blocksToSync.map(async (blockNumber) => syncBlock(client, provider, blockNumber)))
            //console.log('âšī¸ Syncing block:', firstBlock, 'of', current, 'out of sync by', current - firstBlock, 'blocks')

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