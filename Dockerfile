# Use an node image from DockerHub as a parent image
FROM node:21.6.1-slim

# Set the working directory to /homyaksocial-backend
WORKDIR /notes-backend

# Copy required files to the image
COPY index.js .
COPY package-lock.json .
COPY package.json .
COPY models ./models 

# run npm command, which looks for package-lock.json and install all deps from where
# as result directory node_modules will be created
RUN npm install --omit=dev

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run npm start command when the container launches
CMD ["npm", "start"]