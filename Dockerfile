# Get the recommended docker image for running tests in Playwright
FROM mcr.microsoft.com/playwright:v1.40.0-jammy
 
# Set the work directory for the application
WORKDIR /app
 
# Set the environment path to node_modules/.bin
ENV PATH /app/node_modules/.bin:$PATH

# COPY the needed files to the app folder in Docker image
COPY package.json /app/
COPY tests/ /app/tests/
COPY tsconfig.json /app/
COPY playwright.config.ts /app/
COPY global-setup.ts /app/

# Install the dependencies in Node environment
RUN npm install
RUN npx playwright install --with-deps chromium