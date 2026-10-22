import {
  addAdditionalAdmin,
  countApplicationsByStatus,
  deleteApplication,
  getApplication,
  listAdditionalAdmins,
  listApplications,
  removeAdditionalAdmin,
  setApplicationStatus,
  type ApplicationRecord,
  type ApplicationStatus,
} from "@/lib/applications";

interface TelegramUser {
  id: number;
  first_name?: string;
  username?: string;
}

interface TelegramMessage {
  message_id: number;
  chat: { id: number };
  text?: string;
  from?: TelegramUser;
}

interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUpdate {
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

interface TelegramResponse<T> {
  ok: boolean;
  result: T;
  description?: string;
}

const BOT_TOKEN = () => process.env.TELEGRAM_BOT_TOKEN?.trim();

function owners(): string[] {
  return (process.env.TELEGRAM_ADMIN_IDS ?? "7884442701")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function isTelegramAdmin(userId: number | string): boolean {
  const id = String(userId);
  return owners().includes(id) || listAdditionalAdmins().includes(id);
}

async function telegramCall<T>(method: string, payload: Record<string, unknown>): Promise<T> {
  const token = BOT_TOKEN();
  if (!token) throw new Error("Telegram bot token is not configured.");

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = (await response.json()) as TelegramResponse<T>;
  if (!response.ok || !data.ok) {
    throw new Error(data.description ?? `Telegram API request failed (${response.status}).`);
  }
  return data.result;
}

function admins(): string[] {
  return Array.from(new Set(owners().concat(listAdditionalAdmins())));
}

function applicationText(application: ApplicationRecord): string {
  return [
    "📝 Yangi kurs arizasi",
    `Ism: ${application.name}`,
    `Telefon: ${application.phone}`,
    `Kurs: ${application.course}`,
    `Tajriba: ${application.experience}`,
    `Holat: ${statusLabel(application.status)}`,
    `Ariza ID: ${application.id}`,
  ].join("\n");
}

function statusLabel(status: ApplicationStatus): string {
  return { pending: "Kutilmoqda", accepted: "Qabul qilindi", declined: "Rad etildi" }[status];
}

function applicationKeyboard(application: ApplicationRecord) {
  if (application.status !== "pending") {
    return { inline_keyboard: [[{ text: "🗑 Arizani o‘chirish", callback_data: `delete-confirm:${application.id}` }]] };
  }
  return {
    inline_keyboard: [
      [
        { text: "✅ Qabul qilish", callback_data: `status:accepted:${application.id}` },
        { text: "↩ Rad etish", callback_data: `status:declined:${application.id}` },
      ],
      [{ text: "🗑 O‘chirish", callback_data: `delete-confirm:${application.id}` }],
    ],
  };
}

async function sendApplication(application: ApplicationRecord): Promise<void> {
  const deliveries = await Promise.allSettled(
    admins().map((chatId) => telegramCall("sendMessage", {
        chat_id: chatId,
        text: applicationText(application),
        reply_markup: applicationKeyboard(application),
      }))
  );
  if (deliveries.every((delivery) => delivery.status === "rejected")) {
    throw new Error("No Telegram admin could be reached.");
  }
}

export async function notifyAdmins(application: ApplicationRecord): Promise<boolean> {
  if (!BOT_TOKEN()) return false;
  try {
    await sendApplication(application);
    return true;
  } catch (error) {
    console.error("Telegram application notification failed:", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}

async function sendMessage(chatId: number, text: string, replyMarkup?: Record<string, unknown>) {
  await telegramCall("sendMessage", {
    chat_id: chatId,
    text,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  });
}

async function answerCallback(callbackId: string, text: string) {
  await telegramCall("answerCallbackQuery", { callback_query_id: callbackId, text });
}

function menuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "📥 Arizalar", callback_data: "menu:pending" },
        { text: "👥 O‘quvchilar", callback_data: "menu:students" },
      ],
      [{ text: "⚙️ Adminlar", callback_data: "menu:admins" }],
    ],
  };
}

async function sendApplicationList(chatId: number, status: ApplicationStatus, title: string) {
  const records = listApplications(status, 15);
  await sendMessage(chatId, `${title}: ${records.length} ta${records.length === 15 ? " (oxirgi 15 ta)" : ""}.`);
  for (const record of records) {
    await sendMessage(chatId, applicationText(record), applicationKeyboard(record));
  }
}

async function sendStudentsSummary(chatId: number) {
  const counts = countApplicationsByStatus();
  await sendMessage(
    chatId,
    [
      "👥 Arizalar va kursga qabul holati",
      `Qabul qilingan: ${counts.accepted}`,
      `Kutilayotgan: ${counts.pending}`,
      `Rad etilgan: ${counts.declined}`,
      "",
      "Ariza tasdiqlanishi platforma akkaunti yaratmaydi; u faqat qabul holatini belgilaydi.",
    ].join("\n"),
    {
      inline_keyboard: [
        [
          { text: "✅ Qabul qilinganlar", callback_data: "menu:accepted" },
          { text: "⏳ Kutilayotganlar", callback_data: "menu:pending" },
        ],
        [{ text: "↩ Rad etilganlar", callback_data: "menu:declined" }, { text: "⬅ Bosh menyu", callback_data: "menu:home" }],
      ],
    }
  );
}

async function sendAdminsList(chatId: number, actorId: number) {
  const ownersList = owners();
  const additional = listAdditionalAdmins();
  await sendMessage(
    chatId,
    [
      "⚙️ Bot adminlari",
      ...ownersList.map((id) => `${id} — egasi`),
      ...additional.map((id) => `${id} — admin`),
      "",
      ownersList.includes(String(actorId))
        ? "Admin qo‘shish: /addadmin TELEGRAM_ID"
        : "Admin qo‘shish/o‘chirish faqat bot egasiga ruxsat etilgan.",
    ].join("\n"),
    {
      inline_keyboard: [
        ...additional.map((id) => [{ text: `Adminni o‘chirish · ${id}`, callback_data: `admin-remove-confirm:${id}` }]),
        [{ text: "⬅ Bosh menyu", callback_data: "menu:home" }],
      ],
    }
  );
}

async function handleCommand(message: TelegramMessage) {
  if (!message.from || !message.text) return;
  const actorId = message.from.id;
  const text = message.text.trim();
  const chatId = message.chat.id;

  if (text.startsWith("/start")) {
    if (isTelegramAdmin(actorId)) {
      await sendMessage(chatId, "Hackway arizalar paneli. Buyruqlar: /admin", menuKeyboard());
    } else {
      await sendMessage(chatId, "Hackway ariza boti. Admin paneliga ruxsat yo‘q.");
    }
    return;
  }

  if (!isTelegramAdmin(actorId)) {
    await sendMessage(chatId, "Bu buyruq faqat adminlar uchun.");
    return;
  }

  if (text === "/admin" || text === "/menu") {
    await sendMessage(chatId, "Hackway boshqaruv paneli", menuKeyboard());
    return;
  }

  const addMatch = text.match(/^\/addadmin\s+(\d{5,15})$/);
  if (addMatch) {
    if (!owners().includes(String(actorId))) {
      await sendMessage(chatId, "Yangi admin qo‘shish faqat bot egasiga ruxsat etilgan.");
      return;
    }
    addAdditionalAdmin(addMatch[1]);
    await sendMessage(chatId, `Admin qo‘shildi: ${addMatch[1]}. U botga /start yuborsin.`);
    return;
  }

  await sendMessage(chatId, "Buyruqlar: /admin yoki /addadmin TELEGRAM_ID");
}

async function handleCallback(callback: TelegramCallbackQuery) {
  const actorId = callback.from.id;
  const chatId = callback.message?.chat.id;
  const data = callback.data ?? "";
  if (!chatId) return;
  if (!isTelegramAdmin(actorId)) {
    await answerCallback(callback.id, "Ruxsat yo‘q.");
    return;
  }

  if (data === "menu:home") {
    await answerCallback(callback.id, "Bosh menyu");
    await sendMessage(chatId, "Hackway boshqaruv paneli", menuKeyboard());
    return;
  }
  if (data === "menu:pending" || data === "menu:accepted" || data === "menu:declined") {
    const status = data.slice("menu:".length) as ApplicationStatus;
    await answerCallback(callback.id, "Ro‘yxat tayyorlanmoqda");
    await sendApplicationList(chatId, status, { pending: "Kutilayotgan arizalar", accepted: "Qabul qilinganlar", declined: "Rad etilganlar" }[status]);
    return;
  }
  if (data === "menu:students") {
    await answerCallback(callback.id, "Holatlar yangilandi");
    await sendStudentsSummary(chatId);
    return;
  }
  if (data === "menu:admins") {
    await answerCallback(callback.id, "Adminlar ro‘yxati");
    await sendAdminsList(chatId, actorId);
    return;
  }

  const statusMatch = data.match(/^status:(accepted|declined):([\da-f-]{36})$/i);
  if (statusMatch) {
    const status = statusMatch[1] as ApplicationStatus;
    const application = getApplication(statusMatch[2]);
    if (!application) {
      await answerCallback(callback.id, "Ariza topilmadi.");
      return;
    }
    setApplicationStatus(application.id, status);
    const updated = getApplication(application.id)!;
    await answerCallback(callback.id, status === "accepted" ? "Ariza qabul qilindi." : "Ariza rad etildi.");
    if (callback.message) {
      await telegramCall("editMessageText", {
        chat_id: chatId,
        message_id: callback.message.message_id,
        text: applicationText(updated),
        reply_markup: applicationKeyboard(updated),
      });
    }
    return;
  }

  const deleteConfirm = data.match(/^delete-confirm:([\da-f-]{36})$/i);
  if (deleteConfirm) {
    const application = getApplication(deleteConfirm[1]);
    if (!application) {
      await answerCallback(callback.id, "Ariza topilmadi.");
      return;
    }
    await answerCallback(callback.id, "O‘chirishni tasdiqlang.");
    await sendMessage(chatId, `${application.name} — ${application.course} arizasini butunlay o‘chirasizmi?`, {
      inline_keyboard: [[
        { text: "Ha, o‘chirish", callback_data: `delete:${application.id}` },
        { text: "Bekor qilish", callback_data: "menu:pending" },
      ]],
    });
    return;
  }

  const deleteMatch = data.match(/^delete:([\da-f-]{36})$/i);
  if (deleteMatch) {
    const deleted = deleteApplication(deleteMatch[1]);
    await answerCallback(callback.id, deleted ? "Ariza o‘chirildi." : "Ariza topilmadi.");
    if (callback.message) {
      await telegramCall("editMessageText", {
        chat_id: chatId,
        message_id: callback.message.message_id,
        text: deleted ? "🗑 Ariza admin tomonidan o‘chirildi." : "Ariza allaqachon topilmadi.",
      });
    }
    return;
  }

  const adminRemoveConfirm = data.match(/^admin-remove-confirm:(\d{5,15})$/);
  if (adminRemoveConfirm) {
    if (!owners().includes(String(actorId))) {
      await answerCallback(callback.id, "Faqat bot egasi adminlarni boshqaradi.");
      return;
    }
    await answerCallback(callback.id, "Tasdiqlang.");
    await sendMessage(chatId, `${adminRemoveConfirm[1]} admin huquqini olib tashlaysizmi?`, {
      inline_keyboard: [[
        { text: "Olib tashlash", callback_data: `admin-remove:${adminRemoveConfirm[1]}` },
        { text: "Bekor qilish", callback_data: "menu:admins" },
      ]],
    });
    return;
  }

  const adminRemove = data.match(/^admin-remove:(\d{5,15})$/);
  if (adminRemove) {
    if (!owners().includes(String(actorId))) {
      await answerCallback(callback.id, "Faqat bot egasi adminlarni boshqaradi.");
      return;
    }
    const removed = removeAdditionalAdmin(adminRemove[1]);
    await answerCallback(callback.id, removed ? "Admin o‘chirildi." : "Admin topilmadi.");
    await sendAdminsList(chatId, actorId);
  }
}

export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (update.callback_query) {
    await handleCallback(update.callback_query);
    return;
  }
  if (update.message?.text) await handleCommand(update.message);
}
