const { WebcastPushConnection } = require('tiktok-live-connector');
const axios = require('axios');

// CONFIG
const TIKTOK_USERNAME = 'fajarramdani19'; // Ganti dengan username TikTok
const SERVER_URL = 'http://localhost:3000/webhook';

// Init client
const tiktokClient = new WebcastPushConnection(TIKTOK_USERNAME, {
  enableExtendedGiftInfo: true,
  processInitialData: false,
  clientParams: {
    app_language: 'en-US',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  },
  sessionId: 'db7a7c8734f19df5f54e049e50f6d2aa' // Ganti dengan sessionId yang valid
});

// Handle koneksi
tiktokClient.connect()
  .then(state => {
    console.log(`✅ Connected to live @${TIKTOK_USERNAME}`);
    console.log('Room ID:', state.roomId);
    console.log('Viewer Count:', state.viewerCount);
  })
  .catch(err => {
    console.error('❌ Connection Error:');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Stack:', err.stack);
    process.exit(1);
  });

// Handle event gift
tiktokClient.on('gift', async (data) => {
  try {
    console.log(`🎁 Gift ID: ${data.giftId}`);
    console.log('Repeat Count:', data.repeatCount);

    // Kirim ke server
    await axios.post(SERVER_URL, {
      giftId: data.giftId.toString(),
      count: data.repeatCount
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Sent gift to server: ${data.giftId} x${data.repeatCount}`);
  } catch (err) {
    console.error('❌ Gift Error:', err.response?.data || err.message);
  }
});

// Handle event error
tiktokClient.on('error', err => {
  console.error('⚠️ Connection Error:', err.message);
});

// Auto-reconnect
tiktokClient.on('disconnected', () => {
  console.log('🔄 Reconnecting in 5 seconds...');
  setTimeout(() => tiktokClient.connect(), 5000);
});