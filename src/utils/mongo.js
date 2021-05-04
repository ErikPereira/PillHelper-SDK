const mongodb = require("mongodb").MongoClient;

module.exports = class Mongo {
  constructor() {
    // { dbName:"str", connection: mongodb.connect()}
    this.connections = [];
  }

  async getDB(dbName, uri) {
    let con = this.connections.filter(
      connection => connection.dbName === dbName
    )[0];

    if (!con) {
      try {
        con = {
          dbName,
          connection: await mongodb.connect(uri, {
            useUnifiedTopology: true,
          }),
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`MongoDB Connection error: ${error}`);
        throw error;
      }
      this.connections.push(con);
    }

    return con.connection.db();
  }

  async close(dbName) {
    const con = this.connections.filter(
      connection => connection.dbName === dbName
    )[0];

    if (con) {
      try {
        await con.connection.close();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`MongoDB Close error: ${error}`);
        throw error;
      }
      this.connections.splice(this.connections.indexOf(con), 1);
    }
  }

  async closeAll() {
    const close = [];
    for (let i = 0; i < this.connections.length; i += 1) {
      close.push(this.connections[i].connection.close());
    }
    try {
      await Promise.all(close);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`MongoDB Close error: ${error}`);
      throw error;
    }
    this.connections = [];
  }
};
