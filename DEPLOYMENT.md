# Deploy Civic-Connect on Render

Live app: [https://civic-connect-moz0.onrender.com](https://civic-connect-moz0.onrender.com)

The `render.yaml` Blueprint deploys the frontend and Express API as one web service.

1. Push the repository to GitHub.
2. In Render, choose **New → Blueprint** and connect this repository and branch.
3. When prompted, provide `MONGO_URI` for the MongoDB Atlas database. Render generates `JWT_SECRET`.
4. Configure MongoDB Atlas network access to allow connections from the Render service.
5. Wait for the deployment to finish, then open the public URL shown on the Render service page.

Keep database credentials in Render environment variables; never commit `.env`.

The free web service may sleep when idle. Complaint images are stored on the service filesystem and may not survive restarts or redeploys. Use persistent or cloud image storage if those files must be retained.

## Run locally

From `backend/backend`, run `npm ci`, configure `.env` with `MONGO_URI` and `JWT_SECRET`, then run `npm run dev`. Open `http://localhost:5000`.
