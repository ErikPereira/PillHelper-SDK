const Mongo = require("../../../utils/mongo");
const QueryResult = require("../../../utils/queryResult");

const mongo = new Mongo();

class MongoDbCollectionDao {
  constructor(oMongoConnection) {
    this.db = oMongoConnection.mongoDBdb;

    this.mongoUri = `mongodb://${
      oMongoConnection.mongoDBUser
    }:${encodeURIComponent(oMongoConnection.mongoDBPass)}@${
      oMongoConnection.mongoDBURL
    }/${oMongoConnection.mongoDBdb}?authSource=${
      oMongoConnection.mongoDBAuthSource
    }`;

    if (oMongoConnection.mongoDBReplicaSet) {
      this.mongoUri += `&replicaSet=${oMongoConnection.mongoDBReplicaSet}`;
    }
  }

  setURI(oMongoConnection) {
    this.db = oMongoConnection.mongoDBdb;

    this.mongoUri = `mongodb://${
      oMongoConnection.mongoDBUser
    }:${encodeURIComponent(oMongoConnection.mongoDBPass)}@${
      oMongoConnection.mongoDBURL
    }/${oMongoConnection.mongoDBdb}?authSource=${
      oMongoConnection.mongoDBAuthSource
    }`;

    if (oMongoConnection.mongoDBReplicaSet) {
      this.mongoUri += `&replicaSet=${oMongoConnection.mongoDBReplicaSet}`;
    }
  }

  async createCollection(pCollection) {
    const queryResult = new QueryResult();
    try {
      const db = await mongo.getDB(this.db, this.mongoUri);
      queryResult.result = await db.createCollection(pCollection);
    } catch (error) {
      queryResult.hasError = true;
      queryResult.msgError = error.message;
    }
    return queryResult;
  }

  async dropCollection(pCollection) {
    const queryResult = new QueryResult();
    try {
      const db = await mongo.getDB(this.db, this.mongoUri);
      queryResult.result = await db.dropCollection(pCollection);
    } catch (error) {
      queryResult.hasError = true;
      queryResult.msgError = error.message;
    }
    return queryResult;
  }

  async insertOne(pCollection, jsonObject) {
    const queryResult = new QueryResult();
    try {
      const db = await mongo.getDB(this.db, this.mongoUri);
      const result = await db.collection(pCollection).insertOne(jsonObject);
      // eslint-disable-next-line no-underscore-dangle
      queryResult.result = result.ops[0]._id;
    } catch (error) {
      queryResult.hasError = true;
      queryResult.msgError = error.message;
    }
    return queryResult;
  }

  async insertMany(pCollection, array) {
    const queryResult = new QueryResult();
    try {
      const db = await mongo.getDB(this.db, this.mongoUri);
      const result = await db.collection(pCollection).insertMany(array);
      queryResult.result = result.insertedIds;
    } catch (error) {
      queryResult.hasError = true;
      queryResult.msgError = error.message;
    }
    return queryResult;
  }

  async update(
    pCollection,
    jsonFilter,
    jsonObject,
    options = { upsert: false }
  ) {
    const queryResult = new QueryResult();
    try {
      const object = {
        $set: jsonObject,
      };
      const db = await mongo.getDB(this.db, this.mongoUri);
      const result = await db
        .collection(pCollection)
        .updateOne(jsonFilter, object, options);
      queryResult.result = result.matchedCount;
    } catch (error) {
      queryResult.hasError = true;
      queryResult.msgError = error.message;
    }
    return queryResult;
  }

  async updatePush(
    pCollection,
    jsonFilter,
    jsonObject,
    options = { upsert: false }
  ) {
    const queryResult = new QueryResult();
    try {
      const object = {
        $push: jsonObject,
      };
      const db = await mongo.getDB(this.db, this.mongoUri);
      const result = await db
        .collection(pCollection)
        .updateOne(jsonFilter, object, options);
      queryResult.result = result.matchedCount;
    } catch (error) {
      queryResult.hasError = true;
      queryResult.msgError = error.message;
    }
    return queryResult;
  }

  async find(pCollection, jsonFilter) {
    const queryResult = new QueryResult();
    try {
      const db = await mongo.getDB(this.db, this.mongoUri);
      queryResult.result = await db
        .collection(pCollection)
        .find(jsonFilter)
        .toArray();
    } catch (error) {
      queryResult.hasError = true;
      queryResult.msgError = error.message;
    }
    return queryResult;
  }

  async aggregate(pCollection, jsonFilter) {
    const queryResult = new QueryResult();
    try {
      const db = await mongo.getDB(this.db, this.mongoUri);
      queryResult.result = await db
        .collection(pCollection)
        .aggregate(jsonFilter)
        .toArray();
    } catch (error) {
      queryResult.hasError = true;
      queryResult.msgError = error.message;
    }
    return queryResult;
  }

  async remove(pCollection, jsonFilter) {
    const queryResult = new QueryResult();
    try {
      const db = await mongo.getDB(this.db, this.mongoUri);
      queryResult.result = await db
        .collection(pCollection)
        .remove(jsonFilter)
        .toArray();
    } catch (error) {
      queryResult.hasError = true;
      queryResult.msgError = error.message;
    }
    return queryResult;
  }

  async closeConnection() {
    const queryResult = new QueryResult();

    try {
      await mongo.close(this.db);
    } catch (error) {
      queryResult.hasError = true;
      queryResult.msgError = error.message;
    }
    return queryResult;
  }
}

process.on("SIGINT", async () => {
  await mongo.closeAll();
});

module.exports = MongoDbCollectionDao;
