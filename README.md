# COVID-19 Pandemic Statistics

> An application to keep track of coronavirus cases

Live version: https://pandemic19.herokuapp.com

![screencapture-pandemic19-herokuapp-com-1587728671059](https://user-images.githubusercontent.com/54455748/80210468-1cedf680-8634-11ea-8ff9-b54dc0fa46d4.png)

Its objective is to present the data collected from the [covid19.mathdro.id/api](https://covid19.mathdro.id/api) API using statistics, graphs and a heat map, as well as news about coronavirus from different media.

![screencapture-pandemic19-herokuapp-com-app-1587728849338](https://user-images.githubusercontent.com/54455748/80210551-3c851f00-8634-11ea-9343-dfd2e1371f3a.png)

The application has a restricted part that allows registering and managing new cases of infected people, offering a real-time notification service to those users who are nearby.

![screencapture-pandemic19-herokuapp-com-app-1587728738183](https://user-images.githubusercontent.com/54455748/80210593-4ad33b00-8634-11ea-94bc-96e43f25e4ea.png)

In addition, admin users can manage the database, creating or removing users, as well as their health status.

## Installing

In order to run this project locally do the following (on both client and server folders except for step 1):

1. Clone the project
2. Run `npm install` to install all the dependencies
3. Create a .env file and paste the required environment variables in the corresponding field
4. Run `npm run dev` to launch the application and access it at localhost:3000

## Built with

* [React](https://reactjs.org/) for building the client side user interface
* [Material-UI](https://material-ui.com/) to get the structure and styling of the app
* [Express.js](https://expressjs.com/) as the foundation to build the app's backend
* [Mongoose.js](https://mongoosejs.com/) and [MongoDB](https://www.mongodb.com/) to handle platform models and database
* [Socket.IO](https://socket.io/) to provide a real-time, bidirectional and event-based communication

## Overview

This is my final project to be made during the Ironhack Web Development Bootcamp. It is a full-stack web application developed in Javascript. Some of the technologies and frameworks used in the development of the application are **React**, **Node.js**, **Express**, **Mongoose**, **AJAX**, **Passport**, **WebSocket** and **Material-UI**.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/hernandezgonzalo/covid-19/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* Gonzalo Hernández - [LinkedIn](https://www.linkedin.com/in/ghgarcia/)