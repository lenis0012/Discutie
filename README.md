# Discutie

Discutie is an open-source web-based AI Chat interface.  
The name Discutie is a combination of Discussion and Cutie (like how fashion *models* are attractive or cute)

## Disclaimer
This project is still in an experimental "Alpha"/0.0.x state.  
If I happen to do well in the T3.chat cloneathon competition,
I will swiftly make a stable version and documentation.  
Otherwise, it may take some time to settle on a
database schema and upgrading will require wiping your database.

## Features
- Chat with different language models
- Authentication and conversation history (via Postgres)
- Administrative dashboard to manage settings

## Getting Started (Docker)

To get started easily, you can use Docker (or Podman) Compose
to create the web server and database:
```yaml
name: 'discutie'

services:
  server:
    image: ghcr.io/lenis0012/discutie:0.0.6
    restart: unless-stopped
    ports:
      - '3000:3000'
    depends_on:
      - db
    environment:
      PGHOST: 'db'
      # Default admin password
      ADMIN_PASSWORD: 'password'
  db:
    image: pgvector/pgvector:pg16
    restart: always
    # set shared memory limit when using docker compose
    shm_size: 128mb
    environment:
      POSTGRES_USER: discutie
      POSTGRES_PASSWORD: discutie
    # Highly recommended to store data in a directory:
#    volumes:
#      - './postgres-data:/var/lib/postgresql/data'
```

Now navigate to `http://localhost:3000/admin`
and sign in with username `admin` and the configured password.

You can configure some models in the dashboard
and then navigate to the chat interface at `http://localhost:3000`

## Getting started (Local)
Please make sure you have Node.js 22 or above installed and:
1. Download or clone the project and run `npm install`
2. Configure a PostgreSQL database:
   1. Defaults to a local instance with user, pass and db `discutie`
   2. Or set environment variables: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
3. Build the web server: `npm install`
4. Start the web server: `npm run start`
5. Follow the same post-setup instructions as for Docker

## Planned Features

- User management
- Model selection and configuration
  - ~~Claude~~
  - OpenRouter
  - OpenAI
  - Ollama
- Text search
- Image generation
- Attachments
- Smart (contextual) search
- Offline support
- Web search
- Memorization
- Custom characters (context, personality, template)
- MCP support
- Role-based access control
