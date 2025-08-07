import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://iabclikcfddqjcswhqwo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYmNsaWtjZmRkcWpjc3docXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjM4NjIsImV4cCI6MjA2OTY5OTg2Mn0.IpGizEYbKqQUb8muy335lYCeP-u7mrFLJLUQO9oHPkw";
const ADMIN_ID = '6d8cbbe7-47b5-4398-97f9-d91823b44110';
let supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let sessionUser;
let chatChannel;

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('beforeunload', () => {
  if (chatChannel) supabase.removeChannel(chatChannel);
});

async function init() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session?.user) {
    window.location.replace('login.html');
    return;
  }

  sessionUser = session.user;

  // Reinitialize Supabase with authenticated headers 🔐
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      headers: { Authorization: `Bearer ${session.access_token}` }
    }
  });

  try {
    await Promise.all([
      ensureProfileExists(sessionUser.id, sessionUser.user_metadata),
      loadMessages()
    ]);

    subscribeToMessages();

    const form = document.getElementById('message-form');
    form?.addEventListener('submit', sendMessage);
  } catch (err) {
    console.error('🚨 Init failed:', err);
    alert('Something went wrong while setting up chat.');
  }
}

async function ensureProfileExists(userId, metadata) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId);

  if (!data || data.length === 0) {
   await supabase
  .from('profiles')
  .upsert([{
    id: userId,
    email: metadata?.email || '',
    name: metadata?.full_name || metadata?.name || 'Anonymous',
   avatar_url: metadata?.avatar_url || `https://robohash.org/${userId}`}]);
    console.log('✅ Created new profile for', userId);
  }
}


async function loadMessages() {
  const { data, error } = await supabase
  .from('messages')
  .select(`*, sender:profiles!messages_sender_id_fkey(id,name,avatar_url)`)
  .eq('room_id', 'global-chat')
  .order('created_at', { ascending: true });


  if (error) return console.error('Load error:', error);

  const list = document.getElementById('message-list');
  if (!list) return;
  list.innerHTML = '';
  data.forEach(msg => appendMessage({
    ...msg,
    senderName: msg.sender?.name,
    senderAvatar: msg.sender?.avatar_url
  }));
  scrollToBottom();
}


function subscribeToMessages() {
  chatChannel = supabase
    .channel('chat-global')
    .on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'messages',
  filter: `room_id=eq.global-chat`
}, async ({ new: msg }) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, avatar_url')
    .eq('id', msg.sender_id)
    .maybeSingle();

  appendMessage({
    ...msg,
    senderName: profile?.name || 'Unknown',
    senderAvatar: profile?.avatar_url || `https://robohash.org/${msg.sender_id}`
  });

  scrollToBottom();
})

    .subscribe(({ error }) => {
      if (error) console.error('Subscription error:', error);
    });
}

async function sendMessage(e) {
  e.preventDefault();
  const input = document.getElementById('message-input');
  if (!input) return;
  const content = input.value.trim();
  if (!content) return;

  const { error } = await supabase.from('messages').insert({
    content,
    sender_id: sessionUser.id,
    room_id: 'global-chat'
  });

  if (error) console.error('Send error:', error);
  else input.value = '';
}


function appendMessage(msg) {
  const me = sessionUser.id;
  const isMine = msg.sender_id === me;

  const el = document.createElement('div');
  el.className = `message ${isMine ? 'you' : 'them'}`;
  el.innerHTML = `
    ${!isMine ? `<img src="${sanitize(msg.senderAvatar)}" class="avatar" alt="avatar"
     onerror="this.src='default.png';" />` : ''}
    <div>
      <strong>${isMine ? 'You' : sanitize(msg.senderName || 'Unknown')}</strong><br/>
      ${sanitize(msg.content)}
      <small>${new Date(msg.created_at).toLocaleTimeString()}</small>
    </div>
  `;

  const list = document.getElementById('message-list');
  if (list) list.appendChild(el);
}



function scrollToBottom() {
  const list = document.getElementById('message-list');
  if (list) list.scrollTop = list.scrollHeight;
}

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

