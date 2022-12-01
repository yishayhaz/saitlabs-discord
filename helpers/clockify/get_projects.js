const { db_clockify_projects, get_user } = require("../db");

async function handleGetProjects(interaction) {
  const doesUserExist = await get_user(interaction.user.id);

  if (!doesUserExist) {
    return interaction.reply("You must be registered with clockify");
  }

  db_clockify_projects.find({}, (err, docs) => {
    if (err) {
      interaction.reply("There was an error getting the projects.");
    } else {
      const projects = docs.map((doc) => doc.project_name);
      interaction.reply(`Projects: ${"```"}\n${projects.join("\n")}${"```"}`);
    }
  });
}

function createGetProjectsSlashCommand(commands) {
  commands.create({
    name: "get-projects",
    description: "get all projects",
  });
}

module.exports = {
  handleGetProjects,
  createGetProjectsSlashCommand,
};
