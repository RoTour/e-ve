import type { Message } from 'discord.js';
import { handleWebhookError } from './errorHandler';
/**
 * 
 * @param {*} message 
 */
export const checkChat = async (message: Message, clientId: string) => {
  const channelId = message.channel.id;
  const WEBHOOK_URL_CHAT_CHECK = process.env.WEBHOOK_URL_CHAT_CHECK ?? 'NO_URL';
  try {
    const response = await fetch(WEBHOOK_URL_CHAT_CHECK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelId,
        message: message.content,
        from: message.author.username,
        botId: clientId,
        date: new Date().toISOString(),
      }),
    });
    const responseData = await response.json();
    console.debug('Chat check response:', responseData);
    return responseData['shouldAnswer'] ?? false;
  } catch (error) {
    if (error instanceof Error) handleWebhookError(error, message);
    else console.error('Error processing chat check:', error);
    return false;
  }
}