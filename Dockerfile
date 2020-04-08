FROM node:12

RUN npm i -g serverless

RUN serverless config credentials --provider aws --key AKIAQRZND5OV4PRQ66OF --secret 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

WORKDIR /backend

COPY ./backend .

RUN npm run deploy