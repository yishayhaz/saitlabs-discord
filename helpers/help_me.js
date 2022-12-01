const { EmbedBuilder } = require("discord.js");

function createHelpMeSlashCommand(commands) {
  commands.create({
    name: "help-me",
    description: "Will show you how to use the bot",
  });
}

const clockify_logo =
  "https://image.winudf.com/v2/image1/bWUuY2xvY2tpZnkuYW5kcm9pZF9pY29uXzE2MzMwMjIxNDRfMDc5/icon.png?w=&fakeurl=1";
const helpMeEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Clockify Bot")
  .setThumbnail(clockify_logo)
  .addFields({
    name: "/register [token]",
    value:
      "to start using this bot, you're required to register with your clockify token\nyou can find your token here https://app.clockify.me/user/settings",
  })
  .addFields({
    name: "/delete-me",
    value: "will delete your information",
  })
  .addFields({
    name: "/clockify [project] [hours] [task]",
    value:
      "will record the time in clockify\nhours: 6.5 (=6 hours and 30 minutes)",
  })
  .addFields({
    name: "/get-projects",
    value:
      "view all your projects in clockify\nyou can use the project name in the /clockify command",
  })
  .setTimestamp()
  .setFooter({
    text: "Made by Yishay Hazan",
    iconURL: clockify_logo,
  });

function handleHelpme(interaction) {
  interaction.reply({ embeds: [helpMeEmbed] });
}

module.exports = {
  createHelpMeSlashCommand,
  handleHelpme,
};
