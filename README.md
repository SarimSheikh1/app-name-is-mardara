# Mardara

Mardara is a locally runnable Node.js communication app for authenticated one-to-one voice/video calls and small WebRTC mesh meetings. It uses actual `getUserMedia`, `RTCPeerConnection`, Socket.IO signaling, SQLite, and browser screen sharing.

## Start locally

```bash
copy .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000`. Register two accounts in separate browser profiles or devices. Localhost is a secure context for camera/microphone development.

## What is included

- Secure bcrypt-compatible password hashing (bcryptjs), HTTP-only session cookie, protected APIs, rate limiting, Helmet, request-size limits, file-type/size validation, and SQLite persistence.
- User search and Socket.IO presence; call history; profile settings; create/join meeting links; real-time meeting chat; file upload endpoint.
- Real WebRTC capture and peer-connection primitives with ICE candidate signaling, mute/camera toggles, screen sharing, call ending, and meeting media preview.

## Testing calls

1. Sign in as User A and User B in two distinct browser profiles.
2. Open **Contacts** for User A, select voice or video calling on User B, and accept in User B.
3. For meetings, create a meeting, copy the URL, then open it in both profiles. Each user must allow camera and microphone access.

## Production notes

Serve behind HTTPS and a reverse proxy (for example Nginx) with WebSocket upgrade support. Configure `TURN_SERVER_URL`, `TURN_USERNAME`, and `TURN_PASSWORD` for a TURN relay: STUN alone cannot connect every network pair. The included signaling is intentionally small-group P2P mesh; replace the room media layer with an SFU such as LiveKit, mediasoup, or Janus for larger conferences. Use a production JWT secret, a managed SQL database, object storage with malware scanning for uploads, CSRF protection appropriate to the selected cookie/session model, and an authenticated Socket.IO handshake before public deployment.
