import { ACTION, AuditLog } from "@prisma/client";

export const generateLogMsg = (log: AuditLog) => {
  const {
    action,
    entityTitle,
    entity
  } = log;

  switch (action) {
    case ACTION.CREATE:
      return `created ${entity.toLowerCase()} "${entityTitle}"`;

    case ACTION.UPDATE:
      return `updated ${entity.toLowerCase()} "${entityTitle}"`;

    case ACTION.DELETE:
      return `deleted ${entity.toLowerCase()} "${entityTitle}"`;

    default:
      return `unkown action ${entity.toLowerCase()} "${entityTitle}"`;
  }
}
