import { Client } from "@elastic/elasticsearch";
import { config } from "./config";
import { log } from "./logger";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";

const esClient = new Client({
  node: config.ELASTIC_SEARCH_URL,
});

export async function checkElasticSearchConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await esClient.cluster.health();
      log.info(
        `Notification service checkConnection() method: Elasticsearch health status - ${health.status}`
      );
      isConnected = true;
    } catch (error) {
      log.error(
        "Notification service checkConnection() method: Connection to elasticsearch failed, Restrting...",
        error
      );
    }
  }
}
