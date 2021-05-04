db.auth("admin", "admin");

db = db.getSiblingDB("pillhelp_db");

db.createUser({
  user: "admin",
  pwd: "admin",
  roles: ["dbOwner"],
});

db.createCollection("user");
db.createCollection("box");
db.createCollection("pharmaceutical");