import paramiko
import os
import sys
import io
from pathlib import Path

HOST = '8.217.90.193'
USER = 'root'
PASSWORD = '&G7B@CNd&KlbeL'
DIST_DIR = Path(__file__).parent.parent / 'dist'
REMOTE_PATH = '/var/www/love-story'

def run(ssh, cmd, desc=''):
    print(f'  [{desc or cmd[:60]}] ', end='', flush=True)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    exit_code = stdout.channel.recv_exit_status()
    if exit_code != 0 and err:
        print(f'ERR({exit_code}): {err[:200]}')
    else:
        print('OK')
    return out, err, exit_code

def main():
    print('Connecting to server...')
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASSWORD, timeout=15)
    print('Connected.\n')

    # 1. Install nginx
    print('=== Step 1: Install nginx ===')
    run(ssh, 'yum install -y nginx', 'install nginx')

    # 2. Create web directory
    print('\n=== Step 2: Prepare web directory ===')
    run(ssh, f'mkdir -p {REMOTE_PATH}', 'create dir')
    run(ssh, f'chown -R nginx:nginx {REMOTE_PATH}', 'set permissions')

    # 3. Upload dist files via SFTP
    print('\n=== Step 3: Upload website files ===')
    sftp = ssh.open_sftp()
    uploaded = 0
    for root, dirs, files in os.walk(DIST_DIR):
        rel_root = os.path.relpath(root, DIST_DIR)
        remote_root = f'{REMOTE_PATH}/{rel_root}'.replace('\\', '/').rstrip('/')
        if rel_root == '.':
            remote_root = REMOTE_PATH

        # Create remote dirs
        for d in dirs:
            remote_dir = f'{remote_root}/{d}'.replace('\\', '/')
            try:
                sftp.mkdir(remote_dir)
            except:
                pass

        # Upload files
        for f in files:
            local_file = os.path.join(root, f).replace('\\', '/')
            remote_file = f'{remote_root}/{f}'.replace('\\', '/')
            try:
                sftp.put(local_file, remote_file)
                uploaded += 1
                if uploaded % 10 == 0:
                    print(f'  Uploaded {uploaded} files...')
            except Exception as e:
                print(f'  FAILED: {local_file} -> {remote_file}: {e}')

    sftp.close()
    print(f'  Done. {uploaded} files uploaded.')

    # 4. Configure nginx
    print('\n=== Step 4: Configure nginx ===')
    nginx_conf = f'''server {{
    listen 80;
    server_name bluuaaron.com 8.217.90.193;

    root {REMOTE_PATH};
    index index.html;

    location / {{
        try_files $uri $uri/ /index.html;
    }}

    location /assets/ {{
        expires 1y;
        add_header Cache-Control "public, immutable";
    }}

    location /photos/ {{
        expires 7d;
        add_header Cache-Control "public";
    }}

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;
}}
'''
    sftp = ssh.open_sftp()
    sftp.putfo(io.StringIO(nginx_conf), '/etc/nginx/conf.d/love-story.conf')
    sftp.close()
    run(ssh, 'nginx -t 2>&1', 'test nginx config')
    print('  Config written.')

    # 5. Start nginx
    print('\n=== Step 5: Start nginx ===')
    run(ssh, 'systemctl enable nginx', 'enable nginx')
    run(ssh, 'systemctl restart nginx', 'start nginx')

    # 6. Verify
    print('\n=== Step 6: Verify ===')
    out, _, _ = run(ssh, 'curl -s -o /dev/null -w "%{http_code}" http://localhost/')
    print(f'  Local HTTP status: {out}')
    out, _, _ = run(ssh, 'systemctl status nginx --no-pager | head -5')
    print(f'  {out}')

    ssh.close()
    print(f'\nDeploy complete! Visit: http://8.217.90.193')

if __name__ == '__main__':
    main()
