FROM node:12
WORKDIR /app
COPY package.json /app
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list
RUN apt-get update && \
    apt-get install -y google-chrome-stable
RUN npm install && \
    npm install puppeteer && \
    npm install express
COPY . /app
CMD node start.js
EXPOSE 3000