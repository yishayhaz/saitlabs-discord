const { get_user, db_clockify_projects } = require("../db");
const { clockify_api, workspace } = require("../../services/clockify");

const createClockifyEntry = async ({
  clockify_token,
  projectId,
  description,
  start = new Date(),
  end = new Date(),
}) => {
  try {
    return await clockify_api.post(
      `/workspaces/${workspace}/time-entries`,
      {
        start,
        description,
        projectId,
        end,
      },
      {
        headers: {
          "X-Api-Key": clockify_token,
        },
      }
    );
  } catch {
    return null;
  }
};

async function handleClockify(interaction) {
  const project_id = interaction.options.getString("project");
  const hours = interaction.options.getString("hours");
  const task = interaction.options.getString("task");
  const user_id = interaction.user.id;

  if (isNaN(hours)) {
    return interaction.reply("Hours format is incorrect,\nsee `/help-me`");
  }

  const user = await get_user(user_id);

  if (!user) {
    return interaction.reply("You are not registered with clockify");
  }

  const res = await createClockifyEntry({
    clockify_token: user.clockifyToken,
    projectId: project_id,
    description: task,
    start: new Date(new Date() - Number(hours) * 60 * 60 * 1000),
    end: new Date(),
  });

  if (res?.status === 201) {
    return interaction.reply("Time entry added successfully");
  } else {
    return interaction.reply("There was an error adding the time entry");
  }
}

function createClockifySlashCommand(commands) {
  db_clockify_projects.find({}, (err, docs) => {
    if (err) {
      interaction.reply("There was an error getting the projects.");
    } else {
      commands.create({
        name: "clockify",
        description: "clock clocking clockify",
        options: [
          {
            type: 3,
            name: "project",
            description: "project name",
            choices: docs.map((proj) => ({
              name: proj.project_name,
              value: proj.project_id,
            })),
            required: true,
          },
          {
            type: 3,
            name: "hours",
            description: "how many hours",
            required: true,
          },
          {
            type: 3,
            name: "task",
            description: "task description",
            required: true,
          },
        ],
      });
    }
  });
}

module.exports = {
  createClockifyEntry,
  handleClockify,
  createClockifySlashCommand,
};
