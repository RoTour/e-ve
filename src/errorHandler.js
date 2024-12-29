export function handleWebhookError(error, message) {
  console.error('Error processing webhook:', error);

  const errorMessage = 'Sorry, I encountered an error processing your message. Please try again later.';
  
  message.reply({
    content: errorMessage,
    failIfNotExists: false,
  }).catch(replyError => {
    console.error('Failed to send error message:', replyError);
  });
}