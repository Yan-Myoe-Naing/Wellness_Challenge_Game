## Frontend API Usage

**Base URL:** `http://localhost:3000/api`  
**Auth:** `Authorization: Bearer <token>` (for protected routes)

### Index
- `GET /users/me`

### Profile
- `GET /users/profile`
- `POST /cities`
- `GET /armies/:army_id/getBuyableSize`
- `PUT /armies/:army_id/buySoldiers`

### Challenges
- `GET /challenges/overview`
- `POST /challenges`
- `POST /challenges/:challenge_id` (complete)

### Diplomacy
- `GET /diplomacies/overview`
- `POST /diplomacyRequests/alliance`
- `POST /diplomacyRequests/peace`
- `POST /diplomacyRequests/war`
- `PUT /diplomacyRequests/:request_id/accepted`
- `PUT /diplomacyRequests/:request_id/rejected`
- `DELETE /diplomacies/:diplomacy_id`

### Cities
- `GET /cities/overview`
- `POST /battles/armies/:army_id/capture`
- `POST /battles/armies/:army_id/destroy`

### Users
- `GET /users/overview`

## Frontend API Documentation (with Bodies & Errors)

**Base URL:** `http://localhost:3000/api`  
**Auth header:** `Authorization: Bearer <token>` for protected routes.

### Index
**GET** `/users/me` (Auth)  
Returns current user.  
Errors:
- 401 `No token provided` / `Invalid token`
- 500 `Internal server error in getting user by token`

### Profile
**GET** `/users/profile` (Auth)  
Returns combined profile data (user, cities, armies, diplomacies, pending requests).  
Errors:
- 401 `No token provided` / `Invalid token`
- 500 `Internal server error in getting profile data`

**POST** `/cities` (Auth)  
Body:
```json
{ "city_name": "Avalora" }
```
Errors:
- 400 `City name is required`
- 403 `Not enough points to create a city`
- 400 `Population not set before army capacity calculation`
- 404 `City not found` / `Army not found`
- 500 `Internal server error in creating city`
- 500 `Internal server error in creating army`
- 500 `Internal server error in getting city by ID`
- 500 `Internal server error in getting army by ID`
- 401 `No token provided` / `Invalid token`

**GET** `/armies/:army_id/getBuyableSize` (Auth)  
Errors:
- 401 `No token provided` / `Invalid token`
- 403 `You are not the owner of this army`
- 404 `Army not found` / `City not found`
- 500 `Internal server error in getting army by ID`
- 500 `Internal server error in getting city by army`
- 500 `Internal server error in getting user by token`

**PUT** `/armies/:army_id/buySoldiers` (Auth)  
Body:
```json
{ "soldiers": 1000 }
```
Errors:
- 400 `Invalid soldier amount requested`
- 400 `Missing army ID or soldiers amount`
- 403 `You are not the owner of this army`
- 404 `Army not found` / `City not found` / `User not found for this army`
- 500 `Internal server error in getting army by ID`
- 500 `Internal server error in getting city by army`
- 500 `Internal server error in getting user by army`
- 500 `Internal server error in reducing points`
- 500 `Internal server error in updating army soldiers`
- 401 `No token provided` / `Invalid token`

### Challenges
**GET** `/challenges/overview` (Auth)  
Returns user + all challenges + user completions.  
Errors:
- 401 `No token provided` / `Invalid token`
- 500 `Internal server error in getting challenge overview`

**POST** `/challenges` (Auth)  
Body:
```json
{ "description": "Drink 2L of water", "points": 10 }
```
Errors:
- 400 `Error: data is undefined`
- 500 `Error inserting challenge`
- 404 `Challenge not found`
- 500 `Internal server error in getting challenge by ID`
- 401 `No token provided` / `Invalid token`

**POST** `/challenges/:challenge_id` (Auth) — complete challenge  
Body:
```json
{ "details": "Completed 3 days in a row" }
```
Errors:
- 400 `Error: data is undefined`
- 404 `Challenge not found` / `Challenge Completion not found` / `User not found`
- 500 `Internal server error in getting challenge by ID`
- 500 `Error inserting challenge completion`
- 500 `Internal server error in adding points to user`
- 500 `Internal server error in getting challenge completion by ID`
- 401 `No token provided` / `Invalid token`

### Diplomacy
**GET** `/diplomacies/overview` (Auth)  
Returns all diplomacies + your diplomacies + pending requests.  
Errors:
- 401 `No token provided` / `Invalid token`
- 500 `Internal server error in getting diplomacy overview`

**POST** `/diplomacyRequests/alliance` (Auth)  
Body:
```json
{ "target_id": 2 }
```
Errors:
- 400 `sender_id is required` / `receiver_id is required` / `Sender and receiver cannot be the same user`
- 409 `Sender already has an alliance with another user`
- 409 `Receiver already has an alliance with another user`
- 409 `Alliance request already pending from sender to receiver`
- 409 `Alliance request already pending from receiver to sender`
- 500 `Internal server error in getting diplomacy by user_id`
- 500 `Internal server error in getting request for user_id`
- 500 `Internal server error creating diplomacy request`
- 500 `Internal server error in getting diplomacy request by ID`
- 401 `No token provided` / `Invalid token`

**POST** `/diplomacyRequests/peace` (Auth)  
Body:
```json
{ "target_id": 2 }
```
Errors:
- 400 `sender_id is required` / `receiver_id is required` / `Sender and receiver cannot be the same user`
- 409 `Peace request already pending from sender to receiver`
- 409 `Peace request already pending from receiver to sender`
- 500 `Internal server error in getting diplomacy by user_id`
- 500 `Internal server error in getting request for user_id`
- 500 `Internal server error creating diplomacy request`
- 500 `Internal server error in getting diplomacy request by ID`
- 401 `No token provided` / `Invalid token`

**POST** `/diplomacyRequests/war` (Auth)  
Body:
```json
{ "target_id": 2 }
```
Errors:
- 400 `sender_id is required` / `receiver_id is required` / `Sender and receiver cannot be the same user`
- 409 `Cannot declare war while alliance or peace treaty exists`
- 409 `War already exists between these users`
- 500 `Internal server error in getting diplomacy by user_id`
- 500 `Internal server error in getting request for user_id`
- 500 `Internal server error declaring war`
- 500 `Internal server error creating war record`
- 500 `Internal server error in getting diplomacy request by ID`
- 500 `Internal server error in getting diplomacy by ID`
- 401 `No token provided` / `Invalid token`

**PUT** `/diplomacyRequests/:request_id/accepted` (Auth)  
Errors:
- 403 `You cannot accept or reject this request`
- 409 `Diplomacy request already processed`
- 404 `Diplomacy request not found` / `Diplomacy not found`
- 500 `Internal server error in getting diplomacy request by ID`
- 500 `Internal server error in getting diplomacy by ID`
- 500 `Internal server error updating diplomacy request`
- 500 `Internal server error creating diplomacy`
- 401 `No token provided` / `Invalid token`

**PUT** `/diplomacyRequests/:request_id/rejected` (Auth)  
Errors:
- 403 `You cannot accept or reject this request`
- 409 `Diplomacy request already processed`
- 404 `Diplomacy request not found`
- 500 `Internal server error in getting diplomacy request by ID`
- 500 `Internal server error updating diplomacy request`
- 401 `No token provided` / `Invalid token`

**DELETE** `/diplomacies/:diplomacy_id` (Auth)  
Errors:
- 403 `You are not related to this diplomacy`
- 403 `You cannot end a war one sided`
- 404 `Diplomacy not found` / `Diplomacy record not found`
- 500 `Internal server error in getting diplomacy by ID`
- 500 `Internal server error deleting diplomacy`
- 401 `No token provided` / `Invalid token`

### Cities
**GET** `/cities/overview` (Auth)  
Returns all cities + war targets + your cities + your armies.  
Errors:
- 401 `No token provided` / `Invalid token`
- 500 `Internal server error in getting all cities`
- 500 `Internal server error in getting war targets`
- 500 `Internal server error in getting city by user_id`
- 500 `Internal server error in getting armies by city IDs`

**POST** `/battles/armies/:army_id/capture` (Auth)  
Body:
```json
{ "defender_army_id": 2 }
```
Errors:
- 400 `defender_army_id is required in request body`
- 400 `Both attacker and defender armies are required`
- 403 `You are not the owner of this army`
- 404 `Army not found` / `City not found`
- 409 `Cannot battle your own city`
- 409 `Battle not allowed. Attacker and defender are not at war.`
- 500 `Internal server error in getting army by ID`
- 500 `Internal server error in getting city by army`
- 500 `Internal server error in updating city owner`
- 500 `Internal server error in creating new battle`
- 401 `No token provided` / `Invalid token`

**POST** `/battles/armies/:army_id/destroy` (Auth)  
Body:
```json
{ "defender_army_id": 2 }
```
Errors:
- 400 `defender_army_id is required in request body`
- 400 `Both attacker and defender armies are required`
- 403 `You are not the owner of this army`
- 404 `Army not found` / `City not found`
- 409 `Cannot battle your own city`
- 409 `Battle not allowed. Attacker and defender are not at war.`
- 500 `Internal server error in getting army by ID`
- 500 `Internal server error in getting city by army`
- 500 `Internal server error in creating new battle`
- 401 `No token provided` / `Invalid token`

### Users
**GET** `/users/overview`  
Returns raw users + diplomacies (used to render relationship counts on the frontend).  
Errors:
- 500 `Internal server error in getting users overview`
