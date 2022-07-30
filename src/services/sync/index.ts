import { BigNumber, ethers } from "ethers";
import { getNextBlock, saveBlock } from "../../data/postgress";

export async function startSync() {
    while (true) {
        const nextBlock = await getNextBlock()
        console.log('ℹ️ Syncing block:', nextBlock)
        const block = await getBlockData(nextBlock)
        await saveBlock({
            number: block.number,
            data: block
        })
        await new Promise(resolve => setTimeout(resolve, 1))
    }
}

function getBlockData(number: number): Promise<ethers.providers.Block> {
    return ethers.getDefaultProvider(process.env.RPC_URL).getBlock(number)
}