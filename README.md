# TrackProof
> Remote location verification for NRIs and real estate buyers — no manual travel required.

## Overview
TrackProof lets a user pin a location and request verification. A "captain" accepts
the request, travels to the site, and the platform tracks their live progress.
Verification is only allowed once the captain's GPS position is confirmed within
a 100m radius of the pinned location.

### Key Features
- Live tracking of captain progress and status
- Distance calculation between pinned location and captain's live position
- 100m proximity restriction before verification/evidence can be submitted
- [any auth/role features you actually built — fill in honestly]

## Tech Stack
| Layer     | Technology            |
|-----------|------------------------|
| Frontend  | React                  |
| Backend   | Node.js, Express       |
| Database  | PostgreSQL             |

## Architecture
[Diagram: Client <-> Express API <-> PostgreSQL, plus however location updates flow — polling or WebSocket, fill in what you actually used]

## Key Design Decision: The 100m Radius
Explain here (2-3 sentences) why 100m, and how you calculated distance
(e.g., Haversine formula) between two GPS coordinates.

## Setup
[Clone, install, env vars, run — mirror your actual scripts/commands]

## API Endpoints
[List your real routes — don't copy InstantLocate's table, use your own]

## Future Work
- Multi-tenant SaaS model
- [any other real plans]

## License
MIT
