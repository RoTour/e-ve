import type { Message } from 'discord.js';
import { getSessionId } from './bot.js';
import { handleWebhookError } from './errorHandler.js';

export const respond = async (message: Message) => {
  if ('sendTyping' in message.channel) await message.channel.sendTyping();
  const typingInterval = setInterval(async () => {
    if ('sendTyping' in message.channel) await message.channel.sendTyping();
  }, 10000);

  const sessionId = getSessionId(
    message.author.id,
    message.channel.id
  );

  try {
    // Send message content to webhook
    const payload = {
      sessionId,
      action: 'sendMessage',
      chatInput: message.content,
      user: message.author.username,
      channelId: message.channel.id,
    }
    console.debug("Sending message to webhook:", payload);
    const webhookResponse = await fetch(process.env.WEBHOOK_URL ?? '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook request failed with status ${webhookResponse.status}`);
    }

    const responseData = await webhookResponse.json();

    clearInterval(typingInterval);
    
    // Reply to the original message with the webhook response
    await message.reply({
      content: responseData.output?.replaceAll('\\n', '\n') || 'Sorry, but you might wanna check the logs...',
      failIfNotExists: false,
    });

  } catch (error) {
    clearInterval(typingInterval);
    if (error instanceof Error) handleWebhookError(error, message);
    else console.error('Error processing response:', error);
  }
}