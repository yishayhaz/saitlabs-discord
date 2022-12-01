const Datastore = require("nedb"),
  database = new Datastore();

/**
 * clockify_users schema
 * {
 *  userId: string,
 *  clockifyToken: string
 * }
 */
database.clockify_users = new Datastore({
  filename: "./db/clockify_users.db",
  autoload: true,
});

/**
 * clockify_projects schema
 * {
 *  project_name: string,
 *  project_id: string
 * }
 */
database.clockify_projects = new Datastore({
  filename: "./db/clockify_projects.db",
  autoload: true,
});

const get_user = async (userId) =>
  new Promise((resolve) => {
    database.clockify_users.findOne({ userId }, (err, doc) => {
      if (err) {
        resolve(false);
      } else {
        resolve(doc);
      }
    });
  });

const get_project = async ({ project_name, project_id = "-1" }) =>
  new Promise((resolve) => {
    database.clockify_projects.findOne(
      { $or: [{ project_name }, { project_id }] },
      (err, doc) => {
        if (err) {
          resolve(false);
        } else {
          resolve(doc);
        }
      }
    );
  });

module.exports = {
  db_clockify_users: database.clockify_users,
  db_clockify_projects: database.clockify_projects,
  get_user,
  get_project,
};
