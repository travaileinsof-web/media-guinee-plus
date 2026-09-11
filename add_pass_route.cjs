const fs = require('fs');

// 1. Appending route to server.ts
let server = fs.readFileSync('server.ts', 'utf8');
const newRoute = `
app.put('/api/admin/password', authenticateToken, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Mot de passe trop court (min 6)' });
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(newPassword, salt, 64).toString('hex');
  const result = \`scrypt$\${salt}$\${hash}\`;
  
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let env = fs.readFileSync(envPath, 'utf8');
      if (env.includes('ADMIN_PASSWORD_HASH=')) {
        env = env.replace(/ADMIN_PASSWORD_HASH=.*/g, \`ADMIN_PASSWORD_HASH=\${result}\`);
      } else {
        env += \`\\nADMIN_PASSWORD_HASH=\${result}\\n\`;
      }
      fs.writeFileSync(envPath, env);
    }
  } catch (e) {
    console.error("Could not write .env file", e);
  }
  
  process.env.ADMIN_PASSWORD_HASH = result;
  res.json({ success: true });
});
`;

if (!server.includes('/api/admin/password')) {
  server = server.replace('app.use(', newRoute + '\napp.use(');
  fs.writeFileSync('server.ts', server);
}
