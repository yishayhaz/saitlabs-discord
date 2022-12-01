const { db_clockify_projects, get_project, get_user } = require("../db");
const { clockify_api, workspace } = require("../../services/clockify");

async function handleClockifyApi(projectId, clockify_token) {
  try {
    return await clockify_api.get(
      `/workspaces/${workspace}/projects/${projectId}`,
      {
        headers: {
          "X-Api-Key": clockify_token,
        },
      }
    );
  } catch {
    return null;
  }
}

function createAddProjectSlashCommand(commands) {
  commands.create({
    name: "add-project",
    description: "add a project id to the database",
    options: [
      {
        type: 3,
        name: "project",
        description: "project name",
        required: true,
      },
      {
        type: 3,
        name: "id",
        description: "project id",
        required: true,
      },
    ],
  });
}

async function handleAddProject(interaction) {
  const project = interaction.options.getString("project");
  const id = interaction.options.getString("id");

  const userFromDb = await get_user(interaction.user.id);

  if (!userFromDb) {
    return interaction.reply("You are not registered with clockify");
  }

  const projectFromDb = await get_project({
    project_name: project,
    project_id: id,
  });

  if (projectFromDb) {
    return interaction.reply("Project name or clockify_id already exists");
  }

  const res = await handleClockifyApi(id, userFromDb.clockifyToken);

  if (!res) {
    return interaction.reply("Project does not exist in your workspace.");
  }

  db_clockify_projects.insert(
    { project_name: project, project_id: id },
    (err) => {
      if (err) {
        interaction.reply("There was an error adding the project.");
      } else {
        interaction.reply("Project added successfully.");
      }
    }
  );
}

module.exports = {
  createAddProjectSlashCommand,
  handleAddProject,
};
