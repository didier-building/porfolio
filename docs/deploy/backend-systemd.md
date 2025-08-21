# Backend deployment with systemd

## Gunicorn service

`/etc/systemd/system/portfolio.service`

```ini
[Unit]
Description=Portfolio backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/portfolio/backend/portfolio_backend
ExecStart=/opt/portfolio/.venv/bin/gunicorn portfolio_backend.wsgi:application --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable --now portfolio
```

## Nginx

`/etc/nginx/sites-available/portfolio.conf`

```nginx
server {
    listen 80;
    server_name example.com;

    location /media/ {
        alias /opt/portfolio/backend/portfolio_backend/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site and reload nginx:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio.conf /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

