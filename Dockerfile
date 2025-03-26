FROM node:18

# Install system dependencies for rtpengine if needed
RUN apt-get update && apt-get install -y \
  iproute2 \
  net-tools \
  && rm -rf /var/lib/apt/lists/*

# Set up app
WORKDIR /usr/src/app
COPY . .

# Install dependencies
RUN npm install

# Expose necessary ports
EXPOSE 5060/udp
EXPOSE 3000

CMD ["npm", "start"]
