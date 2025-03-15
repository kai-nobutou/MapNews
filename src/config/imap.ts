import env from "./env";  

const IMAP_CONFIG = {
  user: env.IMAP_USER,
  password: env.IMAP_PASS,
  host: env.IMAP_HOST,
  port: env.IMAP_PORT,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

export default IMAP_CONFIG;