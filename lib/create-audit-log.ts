import { auth, currentUser } from "@clerk/nextjs/server";
import { ACTION, ENTITY } from '@prisma/client';
import { db } from "@/lib/db";

interface Props {
  entityId: string;
  entity: ENTITY;
  entityTitle: string;
  action: ACTION;
}

export const createAuditLog = async ({ entityId, entity, entityTitle, action }: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!user || !orgId) {
      throw new Error("User not found!");
    }

    await db.auditLog.create({
      data: {
        orgId,
        userId: user.id,
        userImage: user.imageUrl,
        userName: `${user?.firstName} ${user?.lastName}`,
        entityId,
        entity,
        entityTitle,
        action,
      }
    })

  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
}

