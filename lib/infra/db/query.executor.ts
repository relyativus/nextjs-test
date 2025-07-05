import fastCsv from "fast-csv";
import mysql, { QueryResult, RowDataPacket } from "mysql2/promise";

let sharedPool: mysql.Pool;

function getPool() {
  if (!sharedPool) {
    sharedPool = mysql.createPool({
      uri: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      namedPlaceholders: true,
    });
  }
  return sharedPool;
}

export async function executeQuery(
  query: string,
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  params: any
): Promise<RowDataPacket[]> {
  const pool = getPool()
  return pool.execute<RowDataPacket[]>(query, params).then(([rows]) => rows);
}

export async function insertBulk(
  table: string,
  header: string[],
  rows: any[]
): Promise<QueryResult> {
  const sql = `LOAD DATA LOCAL INFILE "mystream" INTO TABLE ${table} FIELDS TERMINATED BY ',' IGNORE 1 LINES (${header.join(
    ","
  )})`;

  const pool = getPool()
  return pool
    .query<QueryResult>({
      sql,
      infileStreamFactory: function () {
        return fastCsv.write(rows, { headers: true });
      },
    })
    .then(([result]) => result);
}
