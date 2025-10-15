# Simple Express + SQLite Auth App

## Setup
- Install Node.js 18+.
- In PowerShell run:

```
npm install
```

## Run (development)
```
npm run dev
```
Open http://localhost:3000

## Run (production)
```
npm start
```

## Features
- Sign up with email + password (bcrypt hashed)
- Login, session via cookie
- Logout redirects to thank-you page
- SQLite file at `database.sqlite`


## To build docker Image
- run command: docker build -t (inoput name of the image)
- example: docker build -t tic4303-3pagewebapp

## Tag the image on docker file
- run command: docker tag (image name) (dokcer desktop id)/(image name):tag (refer to docker desktop image tag column)
- Example: docker tag tic4303-3pagewebapp e089xxxxxx/tic4303-3pagewebapp:latest

## Push the image to docker hub
- run command: docker push (docker desktop id)/(image name):tag
- Example: docker push e089xxxxxx/tic4303-3pagewebapp:latest

## Run the image in docker desktop terminal
- run command: docker run -d -p 3000:3000 --name (name you image file) (docker desktop id)/(image file name in docker hub)
- Example: docker run -d -p 3000:3000 --name tic4303-3pagewebapp e089xxxxx/tic4303-3pagewebapp

## Try to access the webapplication using local host link
- http://localhost:3000