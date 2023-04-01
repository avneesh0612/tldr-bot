import { prisma } from "@/lib/prisma";

export async function getServer(serverID: string) {
  let server = await prisma.server.findUnique({
    where: {
      server_id: serverID,
    },
  });

  if (!server) {
    server = await prisma.server.create({
      data: {
        server_id: serverID,
      },
    });
  }

  return server;
}

export async function updateServer({
  serverID,
  blacklistedMembers,
  blacklistedRoles,
}: {
  serverID: string;
  blacklistedMembers?: string[];
  blacklistedRoles?: string[];
}) {
  const updatedData = await prisma.server.update({
    where: {
      server_id: serverID,
    },
    data: {
      blacklisted_members: blacklistedMembers,
      blacklisted_roles: blacklistedRoles,
    },
  });
  return updatedData;
}
