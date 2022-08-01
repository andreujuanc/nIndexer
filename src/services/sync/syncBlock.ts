import { ethers } from "ethers";
import { saveBlock } from "../../data/models/blocks";
import { saveLogs } from "../../data/models/logs";
import { saveTransactions } from "../../data/models/transactions";
import { PoolClient } from "pg";

export async function syncBlock(client: PoolClient, provider: ethers.providers.Provider, nextBlock: number) {
    for (let i = 0; i < 3; i++) {
        try {
            await _syncBlock(provider, nextBlock, client);
            break;
        } catch (ex) {
            if (i === 2) {
                throw ex;
            }
        }
    }
}

async function _syncBlock(provider: ethers.providers.Provider, nextBlock: number, client: PoolClient) {
    const block = await provider.getBlock(nextBlock);
    const txs = await Promise.all(block.transactions.map(async (hash) => provider.getTransactionReceipt(hash)
    ));
    // const block = await provider.getBlockWithTransactions(nextBlock)
    // const txs = block.transactions
    // const logs = await provider.getLogs({ fromBlock: nextBlock, toBlock: nextBlock });
    if (txs.length > 0) {
        await saveTransactions(client, txs.map(x => ({
            ...x,
            txto: x.to,
            txfrom: x.from,
            gasUsed: x.gasUsed.toString(),
            cumulativeGasUsed: x.cumulativeGasUsed.toString(),
            effectiveGasPrice: x.effectiveGasPrice.toString(),
        })));
        const logs = txs.flatMap(x => x.logs.map(l => ({
            ...l,
            topics: JSON.stringify(l.topics),
            removed: l.removed ?? false
        })));
        if (logs.length > 0) {
            await saveLogs(client, logs.flatMap(log => ({
                ...log,
                topics: typeof log.topics == 'string' ? log.topics : JSON.stringify(log.topics),
                removed: log.removed ?? false
            })));
        }
    }
    await saveBlock(client, {
        number: block.number,
        data: block
    });
}

