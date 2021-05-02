const path = {
  test: ".env.test",
  dev: ".env.dev",
};

module.exports =
  process.env.NODE_ENV && path[process.env.NODE_ENV]
    ? // eslint-disable-next-line import/no-extraneous-dependencies
      require("dotenv").config({ path: path[process.env.NODE_ENV] })
    : null;
