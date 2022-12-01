const { Client, GatewayIntentBits } = require("discord.js");

require("dotenv").config();

const record_time = require("./helpers/clockify/record_time");
const add_project = require("./helpers/clockify/add_project");
const register = require("./helpers/clockify/register");
const get_projects = require("./helpers/clockify/get_projects");
const delete_user = require("./helpers/clockify/delete_user");
const help_me = require("./helpers/help_me");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on("ready", () => {
  console.log("Ready");

  let commands = client.application.commands;

  record_time.createClockifySlashCommand(commands);
  add_project.createAddProjectSlashCommand(commands);
  register.createRegisterSlashCommand(commands);
  get_projects.createGetProjectsSlashCommand(commands);
  delete_user.createDeleteSlashCommand(commands);
  help_me.createHelpMeSlashCommand(commands);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "clockify") {
    record_time.handleClockify(interaction);
  } else if (interaction.commandName === "add-project") {
    add_project.handleAddProject(interaction);
  } else if (interaction.commandName === "register") {
    register.handleRegister(interaction);
  } else if (interaction.commandName === "get-projects") {
    get_projects.handleGetProjects(interaction);
  } else if (interaction.commandName === "delete-me") {
    delete_user.handleDelete(interaction);
  } else if (interaction.commandName === "help-me") {
    help_me.handleHelpme(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
