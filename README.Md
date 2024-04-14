Run development mode with `python manage.py runserver`

Core src and game entrypoint can be found in `/game/static/game/js/src/game.js`

Before building into docker, make all tailwind into CSS with: `python manage.py tailwind build`.

Dockerise with: `docker build --no-cache -t compositionalpointer:latest .`.

Run locally with `docker run -p 8000:8000 compositionalpointer:latest`.

From psql: `\copy (SELECT * FROM game_rounddata) to 'C:<...>\data.csv' with csv`
and: `\copy (SELECT * FROM game_debriefform) to 'C:<...>\data.csv' with csv`

Launch link is: /?source=testing or /?source=prolific

Optional URL params are:
- playerId
- ct [to specify curriculum]
- numBlocks [default = 2, opt = 4]
- doSave [to not save to DB]

Prolific will add the IDs:
- PROLIFIC_ID
- STUDY_ID
- SESSION_ID

/?playerId=alex&ct=BEstudy&numBlocks=2&doSave=false&PROLIFIC_ID=testPID&STUDY_ID=testSID&SESSION_ID=testSessID