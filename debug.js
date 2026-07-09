const https = require('https');
https.get('https://jersey-order.vercel.app/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    // Look for error
    if (data.includes('Error')) {
      const idx = data.indexOf('Error');
      console.log('Found error:', data.substring(Math.max(0,idx-100), idx+200));
    } else {
      console.log('Page length:', data.length, '- No Error found in HTML');
    }
    // Check for __NEXT_DATA__
    const match = data.match(/__NEXT_DATA__[^>]*>([^<]+)/);
    if (match) {
      try {
        const json = JSON.parse(match[1]);
        console.log('Build ID:', json.buildId);
        if (json.props?.pageProps?.error) console.log('Page error:', json.props.pageProps.error);
      } catch(e) { console.log('Parse error:', e.message); }
    }
  });
}).on('error', e => console.log('Request error:', e.message));
