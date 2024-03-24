Run development mode with `python manage.py runserver`

Core src and game entrypoint can be found in `/game/static/game/js/src/game.js`

Before building into docker, make all tailwind into CSS with: `python manage.py tailwind build`.

Dockerise with: `docker build --no-cache -t compositionalpointer:latest .`.

Run locally with `docker run -p 8000:8000 compositionalpointer:latest`.

From psql: `\copy (SELECT * FROM game_rounddata) to 'C:<...>\data.csv' with csv`