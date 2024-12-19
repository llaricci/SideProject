# 📁SideProject📁
Welcome to **SideProject!** 

## Overview
SideProject is a portfolio app for programmers to list and show off their projects and technologies. Projects have their relevant technologies listed. Projects are able to be filtered by specific technologies. Photos and links to source/demos can be attached. Descriptions of projects are in a Markdown-like format. Users are also able to search for other users and projects. The goal of this project is to allow recruiters to quickly see projects relevant to their position, and whether or not the candidate has adequate experience.

## Live Website 
<a href="https://sideproject.slackow.com">https://sideproject.slackow.com</a>

## Tech Stack: 

**Frontend:** NextJS + React, TailwindCSS\
**Backend:** GraphQL, Redis\
**Authentication:** Firebase Auth\
**Database:** MongoDB\
**Containerization:** Docker\
**Site Hosting:** Oracle Cloud

## Installation
### With Docker:
- run `docker-compose up --build` in the root directory
- run `docker-compose exec server npm run seed ` in the root directory
- visit `localhost:3000`

### Without Docker:
### Have 3 separate terminal windows open:

##### First ensure that Mongo is running using this command:
```
brew services start mongodb-community@8.0
```
### Then do the following in each of the 3 terminals:

#### Terminal 1 - Run the following command to run the redis-stack-server:
```
redis-stack-server
```
#### Terminal 2 - Go to server folder (./server) and run following command(s):
##### Run the following commands to install necessary packages, seed the DB and populate it with user data:
```
npm i
npm run seed
npm start
```
#### Terminal 3 - Go to client folder (./client) and run following command(s):
##### Run the following commands to install necessary packages and run the frontend Next.js client:
```
npm i
npm run dev
```

## Notes
- **Test the website before running the seed script**
- Passwords for all test-users is `Test123$`
- Duplicate emails arent allows `ex: user${1-25}@example.com`

## Contributors
This project was a collaborative effort by: 
<a href="https://github.com/llaricci">llaricci</a>, 
<a href="https://github.com/Calvin526">Calvin526</a>, 
<a href="https://github.com/Afernan413">Afernan413</a>, 
<a href="https://github.com/Slackow">Slackow</a>.

