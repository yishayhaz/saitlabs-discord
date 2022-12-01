const { db_clockify_users, get_user } = require("../db");

async function handleDelete(interaction) {
  const userId = interaction.user.id;

  const user = await get_user(userId);

  if (!user) {
    await interaction.reply(`<@${userId}> You are not even registered dude!`);
    return;
  }

  await db_clockify_users.remove({ userId });
  await interaction.reply("Your details have been deleted");
}

function createDeleteSlashCommand(commands) {
  commands.create({
    name: "delete-me",
    description: "delete your details",
  });
}

module.exports = {
  handleDelete,
  createDeleteSlashCommand,
};
