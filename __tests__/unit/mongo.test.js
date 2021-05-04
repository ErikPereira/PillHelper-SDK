require("../../src/config/env-config");
const { v4: uuidv4 } = require("uuid");

const MongoDbCollectionDao = require("../../src/app/infra/mongodb/mongo-collection-dao");
const MongoDbConnection = require("../../src/config/databaseConnection/mongodb-connection-conf");

const mock = require("./mock");

const uuidModel = uuidv4();

describe("Connection failure", () => {
  const oMongoConnection = {
    mongoDBUser: "",
    mongoDBPass: "",
    mongoDBURL: "",
    mongoDBdb: "",
    mongoDBReplicaSet: "mongoDBReplicaSet",
  };

  const mongoDao = new MongoDbCollectionDao(oMongoConnection);
  mongoDao.setURI(oMongoConnection);
  const testCollection = "jestTestCollection";

  it("create collection connection error", async () => {
    const result = await mongoDao.createCollection("");
    expect(result.hasError).toBe(true);
  });

  it("drop collection connection error", async () => {
    const result = await mongoDao.dropCollection("");
    expect(result.hasError).toBe(true);
  });

  it("insert one connection error", async () => {
    const jsonObject = mock.user(uuidv4());

    const result = await mongoDao.insertOne(testCollection, jsonObject);
    expect(result.hasError).toBe(true);
  });

  it("insert many elements connection error", async () => {
    const array = [
      mock.user(uuidv4()),
      mock.user(uuidv4()),
      mock.user(uuidv4()),
    ];
    const result = await mongoDao.insertMany(testCollection, array);

    expect(result.hasError).toBe(true);
  });

  it("update existing data connection error", async () => {
    const jsonFilter = {
      uuid: uuidv4(),
    };
    const jsonObject = {
      uuid: uuidv4(),
      alarms: {
        name: "PillHelper",
      },
    };
    const result = await mongoDao.update(
      testCollection,
      jsonFilter,
      jsonObject
    );
    expect(result.hasError).toBe(true);
  });

  it("select fields connection error", async () => {
    const jsonFilter = {};

    const result = await mongoDao.find(testCollection, jsonFilter);
    expect(result.hasError).toBe(true);
  });
});

describe("Validate Mongo Queries", () => {
  const oMongoConnection = new MongoDbConnection(
    process.env.MONGO_USER,
    process.env.MONGO_PASSWORD,
    process.env.MONGO_URL,
    process.env.MONGO_DB,
    process.env.MONGO_AUTH,
    process.env.MONGO_REPLICA
  );

  const mongoDao = new MongoDbCollectionDao(oMongoConnection);
  const testCollection = "user";

  beforeAll(async () => {
    await mongoDao.createCollection(testCollection);
  });

  afterAll(async () => {
    await mongoDao.dropCollection(testCollection);
  });

  it("create collection error", async () => {
    await mongoDao.createCollection();
  });

  it("drop collection error", async () => {
    await mongoDao.dropCollection();
  });

  it("insert one success", async () => {
    const jsonObject = mock.user(uuidModel);

    const result = await mongoDao.insertOne(testCollection, jsonObject);

    expect(result.hasError).toBe(false);
    expect(result.result).not.toBe(undefined);
    expect(result.result).not.toBe({});
  });

  it("insert one error", async () => {
    const result = await mongoDao.insertOne(testCollection, null);
    expect(result.hasError).toBe(true);
  });

  it("insert many elements success", async () => {
    const array = [
      mock.user(uuidv4()),
      mock.user(uuidv4()),
      mock.user(uuidv4()),
    ];
    const result = await mongoDao.insertMany(testCollection, array);

    expect(result.hasError).toBe(false);
    expect(result.result).not.toBe(undefined);
    expect(result.result).not.toBe({});
  });

  it("insert many error", async () => {
    const result = await mongoDao.insertMany(testCollection, null);

    expect(result.hasError).toBe(true);
  });

  it("update existing data", async () => {
    const jsonFilter = {
      uuid: uuidModel,
    };
    const jsonObject = {
      uuid: uuidModel,
      alarms: [],
      box: [{}],
      login: {},
    };
    const result = await mongoDao.update(
      testCollection,
      jsonFilter,
      jsonObject
    );
    expect(result.hasError).toBe(false);
    expect(result.result).not.toBe(undefined);
    expect(result.result).not.toBe("");
  });

  it("update existing data error", async () => {
    const result = await mongoDao.update(testCollection, null, null);
    expect(result.hasError).toBe(true);
  });

  it("update push", async () => {
    const jsonFilter = {
      uuid: uuidModel,
    };
    const jsonObject = {
      alarms: [{ teste: "teste" }],
    };
    const result = await mongoDao.updatePush(
      testCollection,
      jsonFilter,
      jsonObject
    );
    expect(result.hasError).toBe(false);
    expect(result.result).not.toBe(undefined);
    expect(result.result).not.toBe("");
  });

  it("update push error", async () => {
    const result = await mongoDao.updatePush(testCollection, null, null);
    expect(result.hasError).toBe(true);
  });

  it("select fields", async () => {
    const jsonFilter = {};

    const result = await mongoDao.find(testCollection, jsonFilter);
    expect(result.hasError).toBe(false);
    expect(result.result).not.toBe(undefined);
    expect(result.result).not.toBe("");
  });

  it("select fields error", async () => {
    const result = await mongoDao.find(null, null);
    expect(result.hasError).toBe(true);
  });

  it("aggregate fields", async () => {
    const jsonFilter = [
      {
        $unwind: "$contracts",
      },
      {
        $unwind: "$contracts.configItems",
      },
      {
        $match: {
          $and: [
            {
              ucm_id: "ucmid1",
            },
            {
              "contracts.name": {
                $in: ["cNumber1", "cNumber2", "unknown"],
              },
            },
            {
              "contracts.configItems.attributes.type": {
                $in: ["hypervisor", "virtualMachine"],
              },
            },
            {
              "contracts.configItems.attributes.name": {
                $in: ["WN-SP-01", "HV-RJ-02", "WN-SP-03"],
              },
            },
            {
              "contracts.configItems.attributes.managementType":
                "Total Management",
            },
          ],
        },
      },
    ];

    const result = await mongoDao.aggregate(testCollection, jsonFilter);
    expect(result.hasError).toBe(false);
    expect(result.result).not.toBe(undefined);
    expect(result.result).not.toBe("");
  });

  it("aggregate fields error", async () => {
    const result = await mongoDao.aggregate(null, null);
    expect(result.hasError).toBe(true);
  });
});
