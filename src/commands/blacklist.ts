import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
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
export class Blacklist {
  @Guard(
    PermissionGuard(["MuteMembers"], {
      content: "You do not have the permissions to use this command",
    }),
  )
  @Slash({ description: "blacklist people or roles", name: "blacklist" })
  async withTransformer(
    @SlashOption({
      description: "Role to blacklist",
      name: "role",
      required: false,
      transformer: RoleTransformer,
      type: ApplicationCommandOptionType.Role,
    })
    @SlashOption({
      description: "User to blacklist",
      name: "user",
      required: false,
      transformer: UserTransformer,
      type: ApplicationCommandOptionType.User,
    })
    role: Role | undefined,
    user: User | undefined,
    interaction: ChatInputCommandInteraction,
  ) {
    try {
      await interaction.deferReply();
      if (role && user) {
        return interaction.editReply({
          embeds: [
            {
              title: "Error",
              description: "Please provide either a role or a user",
              color: 0xdc0000,
            },
          ],
        });
      }

      const server = await getServer(interaction.guildId!);

      if (!role && !user) {
        return interaction.editReply({
          embeds: [
            {
              title: "Blacklisted Roles",
              description:
                server.blacklisted_roles.length === 0
                  ? "No roles blacklisted"
                  : server.blacklisted_roles
                      .map(role => `<@&${role}>`)
                      .join("\n"),
              color: 0xdc0000,
            },
            {
              title: "Blacklisted Users",
              description:
                server.blacklisted_members.length === 0
                  ? "No users blacklisted"
                  : server.blacklisted_members
                      .map(user => `<@${user}>`)
                      .join("\n"),
              color: 0xdc0000,
            },
          ],
        });
      }

      if (role) {
        if (server.blacklisted_roles.includes(role.id)) {
          return interaction.editReply({
            content: "Role already blacklisted",
          });
        }

        await updateServer({
          serverID: interaction.guildId!,
          blacklistedRoles: [...server.blacklisted_roles, role.id],
        });
        return interaction.editReply({
          embeds: [
            {
              title: "Blacklisted Role",
              description: `Blacklisted role: <@&${role.id}>`,
              color: 0xdc0000,
            },
          ],
        });
      }

      if (user) {
        if (server.blacklisted_members.includes(user.id)) {
          return interaction.editReply({
            content: "User already blacklisted",
          });
        }

        await updateServer({
          serverID: interaction.guildId!,
          blacklistedMembers: [...server.blacklisted_members, user.id],
        });
        return interaction.editReply({
          embeds: [
            {
              title: "Blacklisted User",
              description: `Blacklisted user: <@${user.id}>`,
              color: 0xdc0000,
            },
          ],
        });
      }
    } catch (error) {
      return interaction.editReply("Something went wrong");
    }
  }
}
