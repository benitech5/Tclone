# Frontend - Telegram Clone

## Tech Stack

- React Native (Expo)
- TypeScript
- Shadcn/UI
- React Navigation

## Setup

### 1. Navigate & Install Dependencies

```bash
cd frontend
npm install

```

## API Base URL Configuration

To run the app and connect to your local backend, you need to set the API base URL:

1. **Find your computer's local IP address:**
   - On Windows, run `ipconfig` in Command Prompt and look for the `IPv4 Address` (e.g., `192.168.1.42`).
   - On Mac/Linux, run `ifconfig` or `ip a`.
2. **Edit `frontend/app.json`:**
   - Find the `extra` section under `expo`.
   - Set `API_BASE_URL` to your local IP, e.g.:
     ```json
     "extra": {
       "API_BASE_URL": "http://192.168.1.42:8080"
     }
     ```
3. **Make sure your phone and computer are on the same Wi-Fi network.**
4. **Restart the Expo app after making changes.**

This allows every developer to set their own backend URL without changing source code. For production, set this value to your production API endpoint.
