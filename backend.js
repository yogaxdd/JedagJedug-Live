  const express = require('express');
  const WebSocket = require('ws');
  const path = require('path');
  const app = express();
  const port = 3000;

  // Konfigurasi Video (Diperbarui)
  const giftMap = {
    '5655': { file: 'video_1.mp4', duration: 11000 }, // Rose
    '7934': { file: 'video_1.mp4', duration: 11000 }, // Rose
    '5333': { file: 'video_2.mp4', duration: 24000 }, // Coffee
    '7974': { file: 'video_3.mp4', duration: 26000 }, // Anemo Slime
    '5879': { file: 'video_4.mp4', duration: 30000 }, // Donat
    '9463': { file: 'video_5.mp4', duration: 23000 }, // Fairy wings
    '6064': { file: 'video_6.mp4', duration: 18000 }, // GG
    '5487': { file: 'video_7.mp4', duration: 22000 }, // Finger Heart
    '8913': { file: 'video_8.mp4', duration: 16000 }, // Rosa
    '6427': { file: 'video_9.mp4', duration: 14000 }, // Hat and Mustache
    '5660': { file: 'video_10.mp4', duration: 33000 }, // Hand Hearts
  };

  const server = app.listen(port, () => {
    console.log(`Server running: http://localhost:${port}`);
  });

  const wss = new WebSocket.Server({ server });

  // Endpoint untuk memutar video secara manual
  app.post('/play-video', express.json(), (req, res) => {
    const { giftId } = req.body;

    if (giftMap[giftId]) {
      const video = giftMap[giftId];
      console.log(`🎬 Playing video manually: ${video.file} | Duration: ${video.duration}`);

      // Kirim pesan WebSocket ke overlay
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'play',
            video: video.file,
            duration: video.duration,
            instanceId: Date.now()
          }));
        }
      });

      res.status(200).send(`Playing video: ${video.file}`);
    } else {
      console.error(`❌ Gift ID ${giftId} not found in giftMap`);
      res.status(404).send(`Gift ID ${giftId} not found`);
    }
  });

  // Serve static files
  app.use(express.static('public'));

  // Route untuk overlay
  app.get('/:username', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/overlay.html'));
  });

  // Route untuk dashboard simulasi
  app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
  });