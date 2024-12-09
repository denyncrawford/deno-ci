import { Hono } from "hono";

export const docsRouter = new Hono();

const Renderer = () => {
  return (
    <html>
      <head>
        <title>Deno CI Documentation</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <body class="bg-gray-100">
        <div class="container mx-auto px-4 py-8 max-w-4xl">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h1 class="text-4xl font-bold mb-4">Deno CI</h1>
            <p class="text-gray-600 mb-8">
              CI service written in deno, inspired by CI Ninja
            </p>

            <h2 class="text-2xl font-semibold mb-4">Usage</h2>
            <ol class="list-decimal list-inside mb-8 space-y-2">
              <li>Install on the server</li>
              <li>
                Add scripts with the name like{" "}
                <span class="bg-gray-200 py-1 px-2 rounded-lg">{"{repository-name}-{branch-name}.sh"}</span>
                {" "}
                to scripts
              </li>
              <li>
                Make sure the files are executable (like <span class="bg-gray-200 py-1 px-2 rounded-lg">sudo chmod +x
                {"{repository-name}-{branch-name}.sh"}</span>)
              </li>
              <li>
                Add Webhook from your GitHub repository to <span class="bg-gray-200 py-1 px-2 rounded-lg">http://
                {"{server-ip}"}:61439/api/webhook</span>
              </li>
              <li>Aaaaand you're done.</li>
            </ol>

            <h2 class="text-2xl font-semibold mb-4">Samples</h2>

            <h3 class="text-xl font-semibold mb-2">memcoin-main.sh</h3>
            <p class="mb-2">
              My sample deploy script that I put on the server in scripts
              folder.
            </p>
            <pre class="bg-gray-800 text-white p-4 rounded-lg mb-8 overflow-x-auto">
              {`#!/bin/bash
set -e

{ # try
  cd /home/memcoin &&
  git reset --hard &&
  git pull &&
  yarn &&
  yarn build-ts &&
  sudo systemctl restart memcoin &&
  curl 'https://api.telegram.org/bot1234/sendMessage?chat_id=1234&text=✅ Memcoin deployed'
} || { # catch
  curl 'https://api.telegram.org/bot1234/sendMessage?chat_id=1234&text=💥 Memcoin failed to deploy'
}`}
            </pre>

            <h3 class="text-xl font-semibold mb-2">deno-ci.service</h3>
            <p class="mb-2">
              My sample systemd service for ubuntu to run deno-ci
            </p>
            <pre class="bg-gray-800 text-white p-4 rounded-lg mb-8 overflow-x-auto">
              {`[Unit]
Description=Service to start deno-ci
After=network.target

[Service]
WorkingDirectory=/home/deno-ci
ExecStart=/usr/bin/node /home/deno-ci/index.js

[Install]
WantedBy=multi-user.target`}
            </pre>

            <h3 class="text-xl font-semibold mb-2">memcoin.service</h3>
            <p class="mb-2">My sample systemd service for Telegram bots</p>
            <pre class="bg-gray-800 text-white p-4 rounded-lg mb-8 overflow-x-auto">
              {`[Unit]
Description=Service to start memcoin Telegram bot
After=mongodb.service

[Service]
WorkingDirectory=/home/memcoin
ExecStart=/usr/bin/yarn distribute
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target`}
            </pre>

            <h2 class="text-2xl font-semibold mb-4">License</h2>
            <p class="text-gray-600">
              MIT — use for any purpose. Would be great if you could leave a
              note about the original developers. Thanks!
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

docsRouter.get("/", (c) => {
  return c.html(<Renderer />);
});
