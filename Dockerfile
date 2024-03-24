# FROM python:3.13.0a4-alpine3.18
FROM python:3.11-slim

ADD requirements.txt /app/requirements.txt

# RUN set -ex \
#     && apk add --no-cache --virtual .build-deps build-base \
#     && python -m venv /env \
#     && /env/bin/pip install --upgrade pip \
#     && /env/bin/pip install --no-cache-dir -r /app/requirements.txt \
#     && runDeps="$(scanelf --needed --nobanner --recursive /env \
#         | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
#         | sort -u \
#         | xargs -r apk info --installed \
#         | sort -u)" \
#     && apk add --virtual rundeps $runDeps \
#     && apk add libpq-dev postgresql-dev gcc \
#     && apk update \
#     && pip install psycopg2-binary \
#     && apk del .build-deps

RUN apt-get update
RUN apt-get -y install libpq-dev gcc 
RUN pip install --no-cache-dir psycopg2

ADD . /app
WORKDIR /app

RUN pip install -r requirements.txt
# RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", ":8000", "--workers", "10", "--timeout", "5400", "--log-level", "debug", "invertedPointer.wsgi:application"]

# https://www.freecodecamp.org/news/build-and-push-docker-images-to-aws-ecr/