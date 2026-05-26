## Game Summary

Wellness Strategy Game is a simple CRUD-based strategy game where players build their own empire by completing wellness challenges.

Players can earn points, create cities, recruit armies, form diplomacy relationships, and battle other players. The game combines healthy habits with strategy gameplay, so progress comes from completing wellness tasks instead of only fighting.


## Frontend API Usage

**Base URL:** `http://localhost:3000/api`  
**Auth:** `Authorization: Bearer <token>` (for protected routes)

## Setup / Run
1) Install dependencies:
```
npm install
```
2) Create `.env` (DB + JWT + BCRYPT):
```
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db
JWT_SECRET=your_secret
BCRYPT_PEPPER=your_secret_word
```
3) Initialize tables:
```
node src/config/initTables.js
```
4) Start server:
```
node src/index.js
```

## Pages
- `index.html` -- game intro, rules/tips, highlights (guest-friendly)
- `login.html` -- user login
- `register.html` -- user registration
- `profile.html` -- profile summary + edit username
- `city.html` -- all cities, your cities (manage armies), battle targets
- `challenge.html` -- active/completed challenges, create challenges
- `diplomacy.html` -- requests + pending, manage alliances/peace/war
- `users.html` -- list all players and diplomatic status

## Game Flow (Short)
- Register an account -> system creates your first city and army.
- Log in to access profile, cities, challenges, diplomacy, and users pages.
- Earn points by completing challenges.
- Spend points to create new cities and buy soldiers for your armies.
- Diplomacy rules: war can be declared one-sided, but can only end with a peace request; alliance/peace are mutual.
- Battle only against users you are at war with; outcomes can capture or destroy cities.
- Deleting a challenge completion is an undo action that removes the record and deducts points (only allowed if you have enough points).

## Project Structure
- `src/routes` -- API routes
- `src/controllers` -- request handling and validation
- `src/models` -- MySQL queries
- `src/middlewares` -- auth, points, and shared utilities
- `public/js` -- frontend logic
- `public/css` -- styling

### Index
- `GET /api/users/me`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Profile
- `GET /api/users/profile`
- `PUT /api/users`

### Challenges
- `GET /api/challenges/overview`
- `POST /api/challenges`
- `POST /api/challenges/:challenge_id`
- `DELETE /api/userCompletions/:completion_id`

### Diplomacy
- `GET /api/diplomacies/overview`
- `POST /api/diplomacyRequests/alliance`
- `POST /api/diplomacyRequests/peace`
- `POST /api/diplomacyRequests/war`
- `PUT /api/diplomacyRequests/:request_id/accepted`
- `PUT /api/diplomacyRequests/:request_id/rejected`
- `DELETE /api/diplomacyRequests/:request_id`
- `DELETE /api/diplomacies/:diplomacy_id`

### Cities
- `GET /api/cities/overview`
- `POST /api/cities`
- `GET /api/armies/:army_id/getBuyableSize`
- `PUT /api/armies/:army_id/buySoldiers`
- `POST /api/battles/armies/:army_id/capture`
- `POST /api/battles/armies/:army_id/destroy`

### Users
- `GET /api/users/overview`

## Frontend API Documentation (with Bodies & Errors)

**Base URL:** `http://localhost:3000/api`  
**Auth header:** `Authorization: Bearer <token>` for protected routes.

## Testing (Quick)
1) `GET /api/users/overview` → pick a target user ID (not yourself)
2) `GET /api/challenges/overview` → pick a challenge ID (or create one)
3) `GET /api/cities/overview` → pick your `army_id` and any `warTargets.defender_army_id`
4) `GET /api/diplomacies/overview` → pick a **pending request you sent** before deleting

### Index
**GET** `/users/me` (Auth)  
Returns current user (used to check login state if needed).  
Success:
- 200 `User details:`
Errors:
- 401 `No token provided` / `Invalid token`

### Auth
**POST** `/auth/register`  
Body:
```json
{ "username": "player1", "city_name": "Milan", "password": "1234" }
```
Success:
- 201 `Player created successfully`
Errors:
- 400 `Username or password is missing.`
- 400 `Username must be 3-20 characters (letters and numbers only).`
- 400 `Password must be at least 4 characters.`
- 409 `username already exists`

**POST** `/auth/login`  
Body:
```json
{ "username": "Reily", "password": "1234" }
```
Success:
- 201 `Logged in successfully`
Errors:
- 400 `Username or password is missing.`
- 404 `User not found`
- 401 `Wrong password`

### Profile
**GET** `/users/profile` (Auth)  
Returns combined profile data (user, cities, armies, diplomacies, pending requests).  
Success:
- 200 `User profile data:`
Errors:
- 401 `No token provided` / `Invalid token`

**PUT** `/users` (Auth)  
Body:
```json
{ "username": "newName" }
```
Success:
- 200 `User updated successfully`

Errors:
- 400 `Error: data is undefined`
- 404 `User not found`
- 409 `Username already exists`
- 401 `No token provided` / `Invalid token`

### Challenges
**GET** `/challenges/overview` (Auth)  
Returns user + all challenges + user completions.  
Success:
- 200 `Challenge overview:`
Errors:
- 401 `No token provided` / `Invalid token`

**POST** `/challenges` (Auth)  
Body:
```json
{ "description": "Drink 2L of water", "points": 10 }
```
Success:
- 201 `Challenge created successfully`
Errors:
- 400 `Error: data is undefined`
- 401 `No token provided` / `Invalid token`

**POST** `/challenges/:challenge_id` (Auth) -- complete challenge  
Body:
```json
{ "details": "Completed 3 days in a row" }
```
Success:
- 201 `Challenge completed successfully`
Errors:
- 400 `Error: data is undefined`
- 404 `Challenge not found` / `Challenge Completion not found` / `User not found`
- 401 `No token provided` / `Invalid token`

**DELETE** `/userCompletions/:completion_id` (Auth)  
Success:
- 200 `Completion deleted`
Errors:
- 403 `Not your completion`
- 403 `Not enough points to delete completion`
- 404 `Completion not found`
- 404 `Challenge not found`
- 404 `User not found`
- 401 `No token provided` / `Invalid token`

### Diplomacy
**GET** `/diplomacies/overview` (Auth)  
Returns all diplomacies + your diplomacies + pending requests + your requests.  
Success:
- 200 `Diplomacy overview:`
Errors:
- 401 `No token provided` / `Invalid token`

**POST** `/diplomacyRequests/alliance` (Auth)  
Body:
```json
{ "target_id": 3 }
```
Success:
- 201 `Alliance request created by user to user {target_id}.`
Errors:
- 400 `sender_id is required` / `receiver_id is required` / `Sender and receiver cannot be the same user`
- 409 `Sender already has an alliance with another user`
- 409 `Receiver already has an alliance with another user`
- 409 `Alliance request already pending from sender to receiver`
- 409 `Alliance request already pending from receiver to sender`
- 401 `No token provided` / `Invalid token`

**POST** `/diplomacyRequests/peace` (Auth)  
Body:
```json
{ "target_id": 2 }
```
Success:
- 201 `Peace request created by user to user {target_id}.`
Errors:
- 400 `sender_id is required` / `receiver_id is required` / `Sender and receiver cannot be the same user`
- 409 `Peace request already pending from sender to receiver`
- 409 `Peace request already pending from receiver to sender`
- 401 `No token provided` / `Invalid token`

**POST** `/diplomacyRequests/war` (Auth)  
Body:
```json
{ "target_id": 2 }
```
Success:
- 201 `War declared against user {target_id}.`
Errors:
- 400 `sender_id is required` / `receiver_id is required` / `Sender and receiver cannot be the same user`
- 409 `Cannot declare war while alliance or peace treaty exists`
- 409 `War already exists between these users`
- 401 `No token provided` / `Invalid token`

**PUT** `/diplomacyRequests/:request_id/accepted` (Auth)  
Success:
- 200 `Diplomacy request {request_id} accepted.`
Errors:
- 403 `You cannot accept or reject this request`
- 409 `Diplomacy request already processed`
- 404 `Diplomacy request not found` / `Diplomacy not found`
- 401 `No token provided` / `Invalid token`

**PUT** `/diplomacyRequests/:request_id/rejected` (Auth)  
Success:
- 200 `Diplomacy request {request_id} rejected.`
Errors:
- 403 `You cannot accept or reject this request`
- 409 `Diplomacy request already processed`
- 404 `Diplomacy request not found`
- 401 `No token provided` / `Invalid token`

**DELETE** `/diplomacyRequests/:request_id` (Auth)  
Success:
- 200 `Diplomacy request {request_id} deleted.`
Errors:
- 403 `You cannot delete this request`
- 404 `Diplomacy request not found`
- 401 `No token provided` / `Invalid token`

**DELETE** `/diplomacies/:diplomacy_id` (Auth)  
Success:
- 200 `Diplomacy deleted:`
Errors:
- 403 `You are not related to this diplomacy`
- 403 `You cannot end a war one sided`
- 404 `Diplomacy not found` / `Diplomacy record not found`
- 401 `No token provided` / `Invalid token`

### Cities
**GET** `/cities/overview` (Auth)  
Returns current user + all cities + war targets + your cities + your armies.  
Success:
- 200 `City overview:`
Errors:
- 401 `No token provided` / `Invalid token`

**POST** `/cities` (Auth)  
Body:
```json
{ "city_name": "Avalora" }
```
Success:
- 201 `City '{name}' created successfully for user {owner_id}`
Errors:
- 400 `City name is required`
- 403 `Not enough points to create a city`
- 400 `Population not set before army capacity calculation`
- 404 `City not found` / `Army not found`
- 401 `No token provided` / `Invalid token`

**GET** `/armies/:army_id/getBuyableSize` (Auth)  
Use `GET /cities/overview` to pick a valid `army_id`.  
Success:
- 200 `Buyable army size for army {army_id}:`
Errors:
- 401 `No token provided` / `Invalid token`
- 403 `You are not the owner of this army`
- 404 `Army not found` / `City not found`

**PUT** `/armies/:army_id/buySoldiers` (Auth)  
Body:
```json
{ "soldiers": 1000 }
```
Use `GET /armies/:army_id/getBuyableSize` to ensure `soldiers` is within buyable size.  
Success:
- 200 `Army {army_id} successfully bought soldiers.`
Errors:
- 400 `Invalid soldier amount requested`
- 400 `Missing army ID or soldiers amount`
- 403 `You are not the owner of this army`
- 404 `Army not found` / `City not found` / `User not found for this army`
- 401 `No token provided` / `Invalid token`

**POST** `/battles/armies/:army_id/capture` (Auth)  
Body:
```json
{ "defender_army_id": 2 }
```
Use `GET /cities/overview` to pick `defender_army_id` from `warTargets`.  
Success:
- 201 `Battle initiated by army {army_id}. Outcome: {result}.`
Errors:
- 400 `defender_army_id is required in request body`
- 400 `Both attacker and defender armies are required`
- 403 `You are not the owner of this army`
- 404 `Army not found` / `City not found`
- 409 `Cannot battle your own city`
- 409 `Battle not allowed. Attacker and defender are not at war.`
- 401 `No token provided` / `Invalid token`

**POST** `/battles/armies/:army_id/destroy` (Auth)  
Body:
```json
{ "defender_army_id": 2 }
```
Use `GET /cities/overview` to pick `defender_army_id` from `warTargets`.  
Success:
- 201 `Battle initiated by army {army_id}. Outcome: {result}.`
Errors:
- 400 `defender_army_id is required in request body`
- 400 `Both attacker and defender armies are required`
- 403 `You are not the owner of this army`
- 404 `Army not found` / `City not found`
- 409 `Cannot battle your own city`
- 409 `Battle not allowed. Attacker and defender are not at war.`
- 401 `No token provided` / `Invalid token`

### Users
**GET** `/users/overview`  
Returns raw users + diplomacies (used to render relationship counts on the frontend).  
Success:
- 200 `Users overview:`
Errors:
- 500 `Internal server error in getting users overview`
