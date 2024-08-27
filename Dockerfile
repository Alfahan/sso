FROM playcourt/nodejs:18-alpine
# Set Working Directory
WORKDIR /usr/src/app

# Copy Node Packages Requirement
COPY package*.json ./

USER root

# Install Node Modules Based On Node Packages Requirement
RUN apk add --update --no-cache --virtual .build-dev \
	make \
	python3 \
	g++ \
	#&& npm i -g npm@10.0.0 \
	&& npm i -g node-gyp \
	&& npm i \
	&& apk del .build-dev

# Copy Node Source Code File
COPY . .

RUN npm run-script build

USER user

# Expose Application Port
EXPOSE 8080

CMD ["node", "./dist/main.js"]
