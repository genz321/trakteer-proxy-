const express = require('express');
const axios = require('axios');
const app = express();

// ⚠️ GANTI DENGAN API KEY TRAKTEER KAMU
const TRAKTEER_KEY = 'trapi-c4qnwOZnlCI7CKwkppn4GvLW'

app.get('/top', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.trakteer.id/v1/public/supports?limit=100&page=1',
      {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'key': TRAKTEER_KEY
        }
      }
    );

    const items = response.data?.result?.data || [];
    const totals = {};

    items.forEach(tx => {
      if (tx.status !== 'success') return;
      const name = tx.creator_name || 'Anonim';
      totals[name] = (totals[name] || 0) + (tx.amount || 0);
    });

    const sorted = Object.entries(totals)
      .map(([name, amount]) => ({ name, amount, currency: 'Rp' }))
      .sort((a, b) => b.amount - a.amount)
      .map((entry, i) => ({ ...entry, rank: i + 1 }))
      .slice(0, 10);

    res.json(sorted);

  } catch (e) {
    console.error('Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.send('✅ Trakteer Proxy aktif!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
