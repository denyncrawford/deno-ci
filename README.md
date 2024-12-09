# Deno CI

A lightweight continuous integration service written in Deno, inspired by CI Ninja. This service allows you to execute shell scripts in response to GitHub webhooks, making it perfect for automated deployments and CI/CD pipelines.

## Features

- 🦕 Built with Deno for maximum performance and security
- 🔒 IP-based authentication for GitHub webhooks
- 📜 Shell script execution support
- 🌐 Built-in documentation UI
- 🚀 Cross-platform support (Windows, macOS, Linux)
- 📝 Optional logging server integration

## Prerequisites

- [Deno](https://deno.land/) 1.x or higher
- Git
- Basic understanding of shell scripting

## Installation

### Option 1: Download from Releases

1. Go to the [Releases](https://github.com/yourusername/deno-ci/releases) page
2. Download the appropriate binary for your platform:
   - `deno-ci-darwin` for macOS
   - `deno-ci-linux` for Linux
   - `deno-ci.exe` for Windows
3. Move the binary to your desired location

### Option 2: Build from Source

1. Clone the repository:
```bash
git clone https://github.com/yourusername/deno-ci.git
cd deno-ci
```

2. Create a `.env` file in the root directory:
```env
PORT=3001
LOG_SERVER_URL=http://localhost:3002
AUTHORIZED_IPS=127.0.0.1,localhost
GITHUB_IPS=
AUTHORIZED_SUBNETS=
```

3. Create a `scripts` directory:
```bash
mkdir scripts
```

## Development

To run the project in development mode with hot reloading:

```bash
deno task dev
```

The server will start on `http://localhost:3001` (or your configured PORT).

## Building

The project can be compiled into standalone executables for different platforms:

```bash
# Build for all platforms
deno task build

# Build for specific platforms
deno task build:darwin   # macOS
deno task build:linux    # Linux
deno task build:windows  # Windows
```

Compiled binaries will be available in the `dist` directory.

## Production Deployment

1. Copy the appropriate binary from the `dist` directory to your server

2. Make it executable (Linux/macOS):
```bash
chmod +x deno-ci-linux  # or deno-ci-darwin for macOS
```

3. Create a systemd service (Linux):
```ini
[Unit]
Description=Service to start deno-ci
After=network.target

[Service]
WorkingDirectory=/home/deno-ci
ExecStart=/path/to/deno-ci-linux
Environment=PORT=3001
Environment=LOG_SERVER_URL=http://localhost:3002
Environment=AUTHORIZED_IPS=127.0.0.1,localhost

[Install]
WantedBy=multi-user.target
```

4. Start the service:
```bash
sudo systemctl enable deno-ci
sudo systemctl start deno-ci
```

## Usage

1. Create a shell script in the `scripts` directory with the naming convention:
```
{repository-name}-{branch-name}.sh
```

Example `scripts/my-repo-main.sh`:
```bash
#!/bin/bash
set -e

{
  cd /path/to/project &&
  git pull &&
  yarn &&
  yarn build &&
  pm2 restart my-app
} || {
  echo "Deployment failed"
  exit 1
}
```

2. Make the script executable:
```bash
chmod +x scripts/my-repo-main.sh
```

3. Add a webhook in your GitHub repository settings:
- Payload URL: `http://your-server:3001/api/webhook`
- Content type: `application/json`
- Select events: Push, Pull Request, etc.

## API Endpoints

- `GET /docs` - Documentation UI
- `POST /api/webhook` - GitHub webhook endpoint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| LOG_SERVER_URL | URL for external logging service | http://localhost:3002 |
| AUTHORIZED_IPS | Comma-separated list of allowed IPs | 127.0.0.1,localhost |
| GITHUB_IPS | Comma-separated list of GitHub IPs | [List of GitHub IPs] |
| AUTHORIZED_SUBNETS | Comma-separated list of allowed subnets | [List of GitHub subnets] |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [CI Ninja](https://github.com/denyncrawford/ci-ninja)
- Built with [Hono](https://hono.dev/) web framework
- Powered by [Deno](https://deno.land/)
