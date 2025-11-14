# Typerr - MongoDB Native Driver Version

This is a blogging API built with Node.js, Express, and the native MongoDB driver (without Mongoose).

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Make sure MongoDB is running:**
   ```bash
   # MongoDB should be running on localhost:27017
   ```

3. **Update `.env` file with your settings** (already created)

4. **Run the server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

## Key Differences from Mongoose Version

- Uses native `mongodb` package instead of `mongoose`
- No schema definitions - plain JavaScript objects
- Manual password hashing (no pre-save hooks)
- Uses `ObjectId` from MongoDB directly
- Collections accessed via `db.collection('name')`
- Manual token generation functions

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login and get access token

### Posts
- `GET /posts` - Get all posts (public)
- `POST /posts` - Create post (requires auth)
- `GET /posts/:id` - Get single post (public)
- `PUT /posts/:id` - Update post (requires auth)
- `DELETE /posts/:id` - Delete post (requires auth)

### Comments
- `GET /posts/:id/comments` - Get comments (public)
- `POST /posts/:id/comments` - Create comment (requires auth)

### Likes
- `POST /posts/:id/like` - Toggle like (requires auth)

## Testing in Postman

1. Register: `POST /register` with `{username, email, password}`
2. Login: `POST /login` with `{email, password}` → get `accessToken`
3. For protected routes, add header: `Authorization: Bearer <accessToken>`

## Database Collections

- **users** - User accounts with hashed passwords
- **posts** - Blog posts with author references
- **comments** - Comments on posts
