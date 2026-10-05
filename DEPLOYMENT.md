# Deployment

The site and the CMS are one Node process (Next.js with Payload inside it), with Postgres beside it and
nginx in front. These steps assume a Linux server (Ubuntu or Debian) with Postgres already installed.

## 1. Prerequisites

- **Node.js 20.9 or newer** (22 LTS recommended)
- **Postgres** (already on the server)
- **nginx**, with a TLS certificate (Let's Encrypt via `certbot --nginx`)
- **pm2** to keep the app running: `npm install -g pm2`

## 2. Database

```bash
sudo -u postgres psql
CREATE USER erth WITH PASSWORD 'a-long-random-password';
CREATE DATABASE erth OWNER erth;
\q
```

## 3. Directories

Keep uploaded files outside the release folder, so a new deploy never touches them:

```
/var/www/erth/app        the code (git checkout)
/var/www/erth/uploads    every uploaded file — back this up
```

```bash
sudo mkdir -p /var/www/erth/uploads
sudo chown -R $USER:$USER /var/www/erth
git clone <repo-url> /var/www/erth/app
```

## 4. Environment

Create `/var/www/erth/app/.env`:

```env
DATABASE_URL=postgresql://erth:a-long-random-password@127.0.0.1:5432/erth
PAYLOAD_SECRET=<output of: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
NEXT_PUBLIC_SERVER_URL=https://your-domain
UPLOADS_DIR=/var/www/erth/uploads
MAX_UPLOAD_MB=2048
NODE_ENV=production
```

`PAYLOAD_SECRET` signs admin sessions. Changing it signs everyone out, and losing it is harmless apart from that.

## 5. First install

```bash
cd /var/www/erth/app
npm ci
npm run migrate          # creates the tables
npm run seed             # loads the client-provided content (safe to re-run)
npm run build            # needs the database: pages are pre-rendered from it
pm2 start npm --name erth -- start
pm2 save && pm2 startup  # restart on reboot
```

Open `https://your-domain/admin` and create the first account. It becomes the admin.

## 6. nginx

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain;
    # ssl_certificate lines are added by certbot

    # must be at least MAX_UPLOAD_MB
    client_max_body_size 2100m;
    client_body_timeout 600s;
    proxy_read_timeout 600s;
    proxy_send_timeout 600s;
    # stream large uploads straight through to the app
    proxy_request_buffering off;

    # Public uploads are served by nginx itself: faster, and video seeking works without touching Node.
    # Only these three folders. NEVER expose /var/www/erth/uploads/private.
    location ~ ^/api/(media|videos|documents)/file/(.+)$ {
        alias /var/www/erth/uploads/$1/$2;
        add_header Cache-Control "public, max-age=2592000";
        add_header X-Content-Type-Options nosniff;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

}

server {
    listen 80;
    server_name your-domain;
    return 301 https://$host$request_uri;
}
```

`X-Forwarded-For` is set to the real client address, not appended. The form rate limiter reads it, so a
visitor cannot spoof it.

Files sent through «شارك بالتوثيق» are under `/api/submission-files/file/…`. They always go through the
app, which checks that the person opening them is signed in as staff.

## 7. Updating

```bash
cd /var/www/erth/app
git pull
npm ci
npm run migrate      # applies any new migrations
npm run build
pm2 reload erth
```

**Schema changes.** When a collection or field changes, run `npm run migrate:create -- <name>` locally,
commit the generated file in `src/migrations/`, and the deploy's `npm run migrate` applies it. Production
never changes the schema on its own.

## 8. Backups

Back up both of these every night. Neither is useful without the other.

```bash
# /etc/cron.daily/erth-backup
#!/bin/sh
set -e
STAMP=$(date +%F)
mkdir -p /var/backups/erth
pg_dump -Fc -U erth erth > /var/backups/erth/db-$STAMP.dump
tar -czf /var/backups/erth/uploads-$STAMP.tar.gz -C /var/www/erth uploads
find /var/backups/erth -mtime +14 -delete
```

Copy `/var/backups/erth` off the server as well. Restore with `pg_restore -c -d erth db-<date>.dump`
and by extracting the uploads archive back into `/var/www/erth`.

## 9. Notes

- **One process.** Run a single app instance. The form rate limiter and the page cache live in that
  process. Running several instances would need a shared cache handler and a shared rate-limit store.
- **Videos.** Uploaded files must be MP4 (H.264 video, AAC audio) or WebM to play in every browser.
  For very long recordings, a YouTube link uses no server bandwidth.
- **Disk.** Videos fill a disk quickly. Watch `/var/www/erth/uploads` with `du -sh`.
- **Email.** No email adapter is configured, so password-reset emails are written to the app log. To send
  them, add `@payloadcms/email-nodemailer` with your SMTP details in `src/payload.config.ts`.
