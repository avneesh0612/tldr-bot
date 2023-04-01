import {
  ApplicationCommandOptionType,
  CommandInteraction,
  Role,
  User,
} from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import { PermissionGuard } from "@discordx/utilities";
import { getServer, updateServer } from "@/controllers";

const RoleTransformer = (role: Role): Role => {
  return role;
};

const UserTransformer = (user: User): User => {
  return user;
};

@Discord()
export class RemoveBlacklist {
  @Slash({
    name: "remove-blacklist",
    description: "Remove blacklist from an user/role",
  })
  @Guard(
    PermissionGuard(["MuteMembers"], {
      content: "You do not have the permissions to use this command",
      ephemeral: true,
    }),
  )
  async removeBlacklist(
    @SlashOption({
      description: "Role from which blacklist must be removed",
      name: "role",
      required: false,
      transformer: RoleTransformer,
      type: ApplicationCommandOptionType.Role,
    })
    @SlashOption({
      description: "User from which blacklist must be removed",
      name: "user",
      required: false,
      transformer: UserTransformer,
      type: ApplicationCommandOptionType.User,
    })
    role: Role | undefined,
    user: any | undefined,
    interaction: CommandInteraction,
  ) {
    try {
      if (role && user) {
        return interaction.reply("Please provide either a role or a user");
      }

      if (!role && !user) {
        return interaction.reply(
          "Please provide the user or role from which blacklist must be removed",
        );
      }

      const server = await getServer(interaction.guildId!);

      if (role) {
        if (!server.blacklisted_roles.includes(role.id)) {
          return interaction.reply("The role is not blacklisted");
        }

        await updateServer({
          serverID: interaction.guildId!,
          blacklistedRoles: server.blacklisted_roles.filter(r => r !== role.id),
        });
        return interaction.reply(`Removed blacklist from role: ${role.name}`);
      }

      if (user) {
        if (!server.blacklisted_members.includes(user.id)) {
          return interaction.reply("The user is not blacklisted");
        }

        await updateServer({
          serverID: interaction.guildId!,
          blacklistedMembers: server.blacklisted_members.filter(
            member => member !== user.id,
          ),
        });

        return interaction.reply(
          `Removed blacklist from user: ${user.user.username}`,
        );
      }
    } catch (err) {
      console.error(err);
      return interaction.reply("Something went wrong");
    }
  }
}
