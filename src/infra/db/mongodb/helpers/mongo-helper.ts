import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  uri: null as string,
  client: null as MongoClient,
  isConnected: null as boolean,
  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
    this.client.addListener("connectionCreated", () => {
      this.isConnected = true;
      console.log("MongoDB is Connected ? => ", this.isConnected);
    });
  },
  async disconnect(): Promise<void> {
    await this.client.close();
    this.client.addListener("connectionClosed", () => {
      this.isConnected = false;
    });
    this.client = null;
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.client || !this.isConnected || this.isConnected === null) {
      console.log("MongoDB is Connected ? => ", this.isConnected);
      await this.connect(this.uri);
    }
    return this.client.db().collection(name);
  },
};
