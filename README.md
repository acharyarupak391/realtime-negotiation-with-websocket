# Realtime Payment Settlement w/ Websockets

This repository contains a server and client implementation of a realtime settlement process using websockets. 
The server is written in NodeJS(express & express-ws) and the client is written in NextJS & tailwindcss. 
The server is responsible for handling the connection pools for two parties, A and B and the settlement process between them.
The client is responsible for connecting to the server and sending settlement requests from party A and B.

## How to run the project

- Clone the repository
- Run `yarn setup` in the root directory to install all dependencies for the server and client

- Running the server
  - Run `yarn start:server` to start the server 
    - *(Or `yarn dev:server` to start the server in development mode)*
  - You can visit `http://localhost:8080` in your browser to verify that the server is running

- Running the client
  - Make sure the server is running
  - Run `yarn start:client` to start the client 
    - *(Or `yarn dev:client` to start the client in development mode)*
  - You can visit `http://localhost:3000` in your browser to verify that the client is running
    - *(By default, the client tries to connect to the server at `ws://localhost:8080` for websocket communication. If you are running the server on a different port or different host, you must specify the server address in the `.env` file inside client directory as `NEXT_PUBLIC_WS_URL`)*
