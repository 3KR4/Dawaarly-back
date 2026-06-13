const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const getModel = require("./ads/services/getModel");
const {
  sendAdExpiryWarningEmail,
  sendAdRenewalRequestEmail,
  sendAdRenewedEmail,
} = require("./sendEmail");

const prisma = new PrismaClient();

const ACTIVE_DURATION_DAYS = 30;
const WARNING_BEFORE_DAYS = 3;
const RENEWAL_BUTTON_BEFORE_DAYS = 10;
const MAINTENANCE_INTERVAL_MS = 15 * 60 * 1000;

let lastMaintenanceRunAt = 0;
let lifecycleTableMissing = false;

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const isLifecycleTableMissingError = (error) => {
  const message = String(error?.message || "");

  return (
    error?.code === "P2021" ||
    (message.includes("AdLifecycle") &&
      (message.includes("does not exist") || message.includes("doesn't exist")))
  );
};

const runLifecycleQuery = async (query, fallbackValue) => {
  if (lifecycleTableMissing) return fallbackValue;

  try {
    return await query();
  } catch (error) {
    if (isLifecycleTableMissingError(error)) {
      lifecycleTableMissing = true;
      console.warn(
        "Ad lifecycle table is missing. Expiration and renewal features are temporarily disabled until the Prisma migration is applied.",
      );
      return fallbackValue;
    }

    throw error;
  }
};

const getOwnerDescriptor = (ad, ownerRecord = null) => {
  if (ad?.subuser_id) {
    return {
      type: "SUBUSER",
      id: ad.subuser_id,
      name: ownerRecord?.full_name || "Subuser",
      email: ownerRecord?.email || null,
      phone: ownerRecord?.phone || null,
    };
  }

  if (ad?.user_id) {
    return {
      type: "USER",
      id: ad.user_id,
      name: ownerRecord?.full_name || "User",
      email: ownerRecord?.email || null,
      phone: ownerRecord?.phone || null,
    };
  }

  if (ad?.anonymous_id) {
    return {
      type: "ANONYMOUS",
      id: ad.anonymous_id,
      name: ownerRecord?.full_name || "Anonymous",
      email: ownerRecord?.email || null,
      phone: ownerRecord?.phone || null,
    };
  }

  return null;
};

const getOwnerRecord = async (ad) => {
  if (ad?.subuser_id || ad?.user_id) {
    return prisma.Users.findUnique({
      where: { id: ad.subuser_id || ad.user_id },
      select: { id: true, full_name: true, email: true, phone: true },
    });
  }

  if (ad?.anonymous_id) {
    return prisma.Anonymous.findUnique({
      where: { id: ad.anonymous_id },
      select: { id: true, full_name: true, email: true, phone: true },
    });
  }

  return null;
};

const buildDashboardEditUrl = (tableId, adId) => {
  const appUrl =
    process.env.FRONTEND_URL ||
    process.env.BASE_URL ||
    "https://dawaarly.com";

  return `${appUrl.replace(/\/$/, "")}/dashboard/ads/form?dep=${tableId}&id=${adId}`;
};

const buildRenewalRequestUrl = (tableId, adId, token) => {
  const baseUrl =
    process.env.FRONTEND_URL ||
    process.env.BASE_URL ||
    "https://dawaarly.com";
  const root = baseUrl.replace(/\/$/, "");
  const path = root.includes("localhost")
    ? `http://localhost:5000/ads/renewal-request/${tableId}/${adId}?token=${token}`
    : `${root}/api-proxy/ads/renewal-request/${tableId}/${adId}?token=${token}`;

  return path;
};

const ensureLifecycleForActivation = async (tableId, ad, activatedAt = new Date()) => {
  const hasClientOwner = Boolean(ad?.user_id || ad?.subuser_id || ad?.anonymous_id);
  if (!hasClientOwner) return null;

  const expiresAt = addDays(activatedAt, ACTIVE_DURATION_DAYS);
  const token = crypto.randomBytes(24).toString("hex");

  return runLifecycleQuery(
    () =>
      prisma.AdLifecycle.upsert({
        where: {
          table_id_entity_id: {
            table_id: tableId,
            entity_id: ad.id,
          },
        },
        update: {
          activated_at: activatedAt,
          expires_at: expiresAt,
          expiry_warning_sent_at: null,
          renewal_requested_at: null,
          renewal_last_notified_at: null,
          renewed_at: null,
          renewal_requester_id: null,
          renewal_requester_type: null,
          renewal_request_token: token,
        },
        create: {
          table_id: tableId,
          entity_id: ad.id,
          activated_at: activatedAt,
          expires_at: expiresAt,
          renewal_request_token: token,
        },
      }),
    null,
  );
};

const computeLifecycleMeta = (lifecycle) => {
  if (!lifecycle?.expires_at) return null;

  const now = new Date();
  const expiresAt = new Date(lifecycle.expires_at);
  const diffMs = expiresAt.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isExpired = diffMs <= 0;

  return {
    activated_at: lifecycle.activated_at,
    expires_at: lifecycle.expires_at,
    renewal_requested_at: lifecycle.renewal_requested_at,
    days_left: isExpired ? 0 : daysLeft,
    is_expired: isExpired,
    show_renewal_button: daysLeft <= RENEWAL_BUTTON_BEFORE_DAYS,
  };
};

const loadLifecycleMap = async (ads = []) => {
  if (!ads.length) return {};

  const pairs = ads.map((ad) => ({
    table_id: Number(ad.table_id),
    entity_id: Number(ad.id),
  }));

  const lifecycles = await runLifecycleQuery(
    () =>
      prisma.AdLifecycle.findMany({
        where: {
          OR: pairs,
        },
      }),
    [],
  );

  return lifecycles.reduce((acc, lifecycle) => {
    acc[`${lifecycle.table_id}_${lifecycle.entity_id}`] = lifecycle;
    return acc;
  }, {});
};

const getLifecycleRecord = async (tableId, adId) =>
  runLifecycleQuery(
    () =>
      prisma.AdLifecycle.findUnique({
        where: {
          table_id_entity_id: {
            table_id: tableId,
            entity_id: adId,
          },
        },
      }),
    null,
  );

const sendRenewalRequestEmailsToAdmins = async ({ tableId, ad, owner }) => {
  const admins = await prisma.Users.findMany({
    where: {
      OR: [{ is_super_admin: true }, { user_type: "ADMIN" }],
      email: { not: "" },
    },
    select: { email: true },
  });

  if (!admins.length) return;

  await Promise.allSettled(
    admins.map((admin) =>
      sendAdRenewalRequestEmail({
        to: admin.email,
        adTitle: ad.title,
        ownerName: owner?.name,
        ownerType: owner?.type,
        ownerEmail: owner?.email,
        ownerPhone: owner?.phone,
        dashboardUrl: buildDashboardEditUrl(tableId, ad.id),
      }),
    ),
  );
};

const requestRenewal = async ({
  tableId,
  ad,
  requesterType,
  requesterId = null,
  force = false,
}) => {
  const lifecycle = await runLifecycleQuery(
    () =>
      prisma.AdLifecycle.findUnique({
        where: {
          table_id_entity_id: {
            table_id: tableId,
            entity_id: ad.id,
          },
        },
      }),
    null,
  );

  if (!lifecycle) {
    throw new Error(
      lifecycleTableMissing
        ? "Ad renewal is not available yet because the lifecycle migration has not been applied."
        : "This ad does not have an active-time lifecycle",
    );
  }

  const daysLeft = Math.ceil(
    (new Date(lifecycle.expires_at).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24),
  );

  if (daysLeft > RENEWAL_BUTTON_BEFORE_DAYS) {
    throw new Error("Renewal requests are allowed only in the last 10 days");
  }

  if (!force && lifecycle.renewal_requested_at) {
    const hoursSinceLastRequest =
      (Date.now() - new Date(lifecycle.renewal_requested_at).getTime()) /
      (1000 * 60 * 60);

    if (hoursSinceLastRequest < 24) {
      throw new Error("A renewal request was already sent recently");
    }
  }

  const ownerRecord = await getOwnerRecord(ad);
  const owner = getOwnerDescriptor(ad, ownerRecord);

  await runLifecycleQuery(
    () =>
      prisma.AdLifecycle.update({
        where: {
          table_id_entity_id: {
            table_id: tableId,
            entity_id: ad.id,
          },
        },
        data: {
          renewal_requested_at: new Date(),
          renewal_requester_type: requesterType,
          renewal_requester_id: requesterId,
          renewal_last_notified_at: new Date(),
        },
      }),
    null,
  );

  await sendRenewalRequestEmailsToAdmins({
    tableId,
    ad,
    owner,
  });
};

const renewAdLifecycle = async (tableId, ad) => {
  const now = new Date();
  const lifecycle = await runLifecycleQuery(
    () =>
      prisma.AdLifecycle.findUnique({
        where: {
          table_id_entity_id: {
            table_id: tableId,
            entity_id: ad.id,
          },
        },
      }),
    null,
  );

  if (lifecycleTableMissing) {
    throw new Error(
      "Ad renewal is not available yet because the lifecycle migration has not been applied.",
    );
  }

  const baseDate =
    lifecycle?.expires_at && new Date(lifecycle.expires_at) > now
      ? new Date(lifecycle.expires_at)
      : now;
  const expiresAt = addDays(baseDate, ACTIVE_DURATION_DAYS);

  const updatedLifecycle = await runLifecycleQuery(
    () =>
      prisma.AdLifecycle.upsert({
        where: {
          table_id_entity_id: {
            table_id: tableId,
            entity_id: ad.id,
          },
        },
        update: {
          activated_at: lifecycle?.activated_at || now,
          expires_at: expiresAt,
          expiry_warning_sent_at: null,
          renewal_requested_at: null,
          renewal_last_notified_at: null,
          renewed_at: now,
          renewal_requester_id: null,
          renewal_requester_type: null,
          renewal_request_token:
            lifecycle?.renewal_request_token || crypto.randomBytes(24).toString("hex"),
        },
        create: {
          table_id: tableId,
          entity_id: ad.id,
          activated_at: now,
          expires_at: expiresAt,
          renewed_at: now,
          renewal_request_token: crypto.randomBytes(24).toString("hex"),
        },
      }),
    null,
  );

  if (!updatedLifecycle) {
    throw new Error(
      "Ad renewal is not available yet because the lifecycle migration has not been applied.",
    );
  }

  const ownerRecord = await getOwnerRecord(ad);
  const owner = getOwnerDescriptor(ad, ownerRecord);

  if (owner?.email) {
    await sendAdRenewedEmail({
      to: owner.email,
      adTitle: ad.title,
      expiresAt,
    });
  }

  return updatedLifecycle;
};

const runAdLifecycleMaintenance = async ({ force = false } = {}) => {
  const now = Date.now();
  if (!force && now - lastMaintenanceRunAt < MAINTENANCE_INTERVAL_MS) {
    return { expiredCount: 0, warnedCount: 0 };
  }

  lastMaintenanceRunAt = now;

  const lifecycleQueries = await runLifecycleQuery(
    () =>
      Promise.all([
        prisma.AdLifecycle.findMany({
          where: {
            expires_at: { lte: new Date() },
          },
        }),
        prisma.AdLifecycle.findMany({
          where: {
            expires_at: {
              gt: new Date(),
              lte: addDays(new Date(), WARNING_BEFORE_DAYS),
            },
            OR: [
              { expiry_warning_sent_at: null },
              {
                expiry_warning_sent_at: {
                  lt: addDays(new Date(), -WARNING_BEFORE_DAYS),
                },
              },
            ],
          },
        }),
      ]),
    [[], []],
  );

  const [expiringNow, warningCandidates] = lifecycleQueries;

  let expiredCount = 0;
  let warnedCount = 0;

  for (const lifecycle of expiringNow) {
    const prismaModel = getModel(lifecycle.table_id);
    if (!prismaModel) continue;

    const ad = await prismaModel.findUnique({
      where: { id: lifecycle.entity_id },
    });

    if (!ad || ad.status !== "ACTIVE") continue;

    await prismaModel.update({
      where: { id: ad.id },
      data: {
        status: "EXPIRED",
        status_changed_at: new Date(),
      },
    });

    expiredCount += 1;
  }

  for (const lifecycle of warningCandidates) {
    const prismaModel = getModel(lifecycle.table_id);
    if (!prismaModel) continue;

    const ad = await prismaModel.findUnique({
      where: { id: lifecycle.entity_id },
    });

    if (!ad || ad.status !== "ACTIVE") continue;

    const ownerRecord = await getOwnerRecord(ad);
    const owner = getOwnerDescriptor(ad, ownerRecord);

    if (!owner?.email) continue;

    try {
      await sendAdExpiryWarningEmail({
        to: owner.email,
        adTitle: ad.title,
        expiresAt: lifecycle.expires_at,
        daysLeft: WARNING_BEFORE_DAYS,
        renewalUrl: buildRenewalRequestUrl(
          lifecycle.table_id,
          lifecycle.entity_id,
          lifecycle.renewal_request_token,
        ),
      });

      await prisma.AdLifecycle.update({
        where: { id: lifecycle.id },
        data: { expiry_warning_sent_at: new Date() },
      });

      warnedCount += 1;
    } catch (error) {
      console.error("Failed to send ad expiry warning", error.message);
    }
  }

  return { expiredCount, warnedCount };
};

module.exports = {
  ACTIVE_DURATION_DAYS,
  WARNING_BEFORE_DAYS,
  RENEWAL_BUTTON_BEFORE_DAYS,
  buildRenewalRequestUrl,
  computeLifecycleMeta,
  ensureLifecycleForActivation,
  getLifecycleRecord,
  loadLifecycleMap,
  requestRenewal,
  renewAdLifecycle,
  runAdLifecycleMaintenance,
};


