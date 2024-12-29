import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { checkChat } from './checkChat.js';
import { respond } from './response.js';


dotenv.config();

// Session management utilities
export const getSessionId = (userId: string, channelId: string) => {
  const now = new Date();
  // Format: userId_channelId_YYYY-MM-DD
  return `${userId}_${channelId}_${now.toISOString().split('T')[0]}`;
  
  // Alternative: Rolling 6-hour windows
  // const timeWindow = Math.floor(now.getHours() / 6);
  // return `${userId}_${channelId}_${now.toISOString().split('T')[0]}_${timeWindow}`;
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  // Ignore messages from bots to prevent potential loops
  if (message.author.bot) return;

  // Replace mentions with the user's name
  message.content = message.content.replace(/<@!?\d+>/g, (match) => {
    const userId = match?.match(/\d+/)?.[0] ?? '';
    const user = message?.guild?.members.cache.get(userId);
    return user ? `@${user.displayName}` : match
  });

  // Check if bot should answer
  const shouldAnswer = await checkChat(message, client.user?.id ?? "");
  if (!shouldAnswer) return;
  await respond(message);
});

// Error handling for the Discord client
client.on(Events.Error, (error) => {
  console.error('Discord client error:', error);
});

// Login to Discord
try {
  await client.login(process.env.DISCORD_TOKEN);
} catch (error) {
  console.error('Failed to login to Discord:', error);
  process.exit(1);
}