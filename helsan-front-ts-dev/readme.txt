Frontend Dev Guide (Local API Proxy via Nginx)
==============================================

1. Start your frontend dev server (e.g. Vite, CRA, Next.js) on port 3000:
   > yarn dev

2. Set the backend API base URL in your frontend `.env` file as:
   VITE_API_URL=https://127.0.0.1/api

   (Do NOT use `localhost`; HTTPS+cookie issues require `127.0.0.1`.)

3. In the file: `dev-nginx/default.conf`
   Ensure this line correctly points to the actual backend:
     proxy_pass https://dev.helsan.pic; (backend dev address goes here)

   This is already set by default — only modify it if needed for debugging.

4. From the project root, run the reverse proxy container:
   > docker-compose up 

5. Open your browser and go to:
   > https://127.0.0.1

   You should see your frontend app, and API calls should go through the `/api` proxy.