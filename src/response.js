import { getSessionId } from './bot.js';

export const respond = async (message) => {
  await message.channel.sendTyping();
  const typingInterval = setInterval(async () => {
    await message.channel.sendTyping();
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
    }
    console.debug("Sending message to webhook:", payload);
    const webhookResponse = await fetch(process.env.WEBHOOK_URL, {
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
      content: responseData.output || 'Sorry, but you might wanna check the logs...',
      failIfNotExists: false,
    });

  } catch (error) {
    clearInterval(typingInterval);
    handleWebhookError(error, message);
  }
}