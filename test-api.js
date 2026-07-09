const https = require('https');
const options = {
  hostname: 'jersey-order.vercel.app',
  path: '/api/order?page=1&limit=5',
  method: 'GET',
  headers: { 'Authorization': 'Bearer CPZ123' }
};
const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const d = JSON.parse(data);
    console.log('Status:', res.statusCode);
    console.log('Success:', d.success);
    console.log('Total orders:', d.total);
    if (d.orders) console.log('Orders:', d.orders.length);
    if (d.error) console.log('Error:', d.error);
  });
});
req.end();
