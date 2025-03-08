const clientId = 'YOUR_CLIENT_ID';
const redirectUri = 'YOUR_REDIRECT_URI';
const scope = 'user.read'; // Adjust scope as needed
const authUrl = `https://id.kick.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

window.location.href = authUrl;

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');