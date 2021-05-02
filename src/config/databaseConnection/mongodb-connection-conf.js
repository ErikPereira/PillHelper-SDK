class MongoConnection {
  constructor(
    mongoDBUser,
    mongoDBPass,
    mongoDBURL,
    mongoDBdb,
    mongoDBAuthSource,
    mongoDBReplicaSet
  ) {
    this.mongoDBUser = mongoDBUser;
    this.mongoDBPass = mongoDBPass;
    this.mongoDBURL = mongoDBURL;
    this.mongoDBdb = mongoDBdb;
    this.mongoDBAuthSource = mongoDBAuthSource;
    this.mongoDBReplicaSet = mongoDBReplicaSet;
  }
}
module.exports = MongoConnection;
