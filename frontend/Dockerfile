FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Add ENV variables
ENV USER_MANAGEMENT_URL ${USER_MANAGEMENT_URL}
ENV TASK_MANAGEMENT_URL ${TASK_MANAGEMENT_URL}

# Build the React app
RUN npm run build
#ENTRYPOINT [ "npm", "run" ]

# ==============
# Define a new image for serving the application
FROM nginx:alpine

# Copy the production build of the React app (replace with your build command)
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port where the application runs (usually 80)
EXPOSE 80

# Configure the default server block
CMD ["nginx", "-g", "daemon off;"]