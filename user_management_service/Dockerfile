FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

ENV MONGO_URI ${MONGO_URI}

COPY ./app ./app

CMD [ "gunicorn", "--bind", "0.0.0.0:5000", "app:app"]