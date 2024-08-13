import { Client } from "@elastic/elasticsearch";

const elasticClient = new Client({ node: process.env.ELASTICSEARCH_URL });

export default elasticClient;
