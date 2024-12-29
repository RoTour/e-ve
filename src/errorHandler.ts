import type { Message } from 'discord.js';

export function handleWebhookError(error: Error, message: Message) {
  console.error('Error processing webhook:', error);

  const errorMessage = 'Sorry, I encountered an error processing your message. Please try again later.';
  
  message.reply({
    content: errorMessage,
    failIfNotExists: false,
  }).catch((replyError) => {
    console.error('Failed to send error message:', replyError);
  });
}