FROM python:3.10-alpine3.18

RUN mkdir  -p /app

COPY . /app

RUN addgroup -S group && adduser -u 10001 -S user -G group

RUN chown user:group /app

USER 10001

WORKDIR /app

RUN pip install -r requirements.txt

# ENTRYPOINT ["python", "sca_badge_generator.py"]
