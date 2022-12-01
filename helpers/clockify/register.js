const { db_clockify_users, get_user } = require("../db");
const { clockify_api } = require("../../services/clockify");

function createRegisterSlashCommand(commands) {
  commands.create({
    name: "register",
    description: "register to clockify",
    options: [
      {
        type: 3,
        name: "token",
        description: "clockify token",
        required: true,
      },
    ],
  });
}

async function handleClockifyApi(token) {
  try {
    const res = await clockify_api.get("/user", {
      headers: {
        "X-Api-Key": token,
      },
    });
    return res;
  } catch {
    return null;
  }
}

async function handleRegister(interaction) {
  const token = interaction.options.getString("token");

  const doesUserExist = await get_user(interaction.user.id);

  if (doesUserExist) {
    return interaction.reply("You are already registered with clockify");
  }

  const res = await handleClockifyApi(token);

  if (!res) {
    return interaction.reply(
      "Invalid token, please get your token here and try again https://app.clockify.me/user/settings"
    );
  }

  db_clockify_users.insert(
    { userId: interaction.user.id, clockifyToken: token },
    (err) => {
      if (err) {
        interaction.reply("There was an error registering.");
      } else {
        interaction.reply("Registered successfully.");
      }
    }
  );
}

module.exports = {
  createRegisterSlashCommand,
  handleRegister,
};
