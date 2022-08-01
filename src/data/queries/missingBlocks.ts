import { PoolClient } from "pg"

const missingBlocksQuery = `
SELECT DISTINCT blocknumber
FROM 
(

	SELECT cAST(blocknumber AS BIGINT) blocknumber
	from GENERATE_SERIES (0, 151349) AS blocknumber

) AS allblocks
LEFT JOIN raw.blocks ON id = blocknumber
WHERE id IS null
`

export const getMissingBlocks = async (client: PoolClient): Promise<number[]> => {
    const { rows } = await client.query(missingBlocksQuery)
    return rows.map(x => x.blocknumber)
}