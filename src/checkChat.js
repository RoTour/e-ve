/**
 * 
 * @param {*} message 
 */
export const checkChat = async (message, clientId) => {
  const channelId = message.channel.id;
  const WEBHOOK_URL_CHAT_CHECK = process.env.WEBHOOK_URL_CHAT_CHECK;
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
    handleWebhookError(error, message);
    return false;
  }
}