<!--
Hey, thanks for using the ultimate-party-room-client template.
If you have any enhancements, then fork this project and create a pull request
or just open an issue with the label "enhancement".

Don't forget to give this project a star for additional support ;)
Maybe you can mention me or this repo in the acknowledgements too
-->
<div align="center">

  <!-- <img src="assets/logo.png" alt="logo" width="200" height="auto" /> -->
  <h1>Ultimate Party Room Server</h1>
  
  <p>
    An awesome platform to have fun with your friends!
  </p>
<h4>
    <a href="https://github.com/GramosTV/ultimate-party-room-client/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/GramosTV/ultimate-party-room-client/issues/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Screenshots](#camera-screenshots)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
  - [Color Reference](#art-color-reference)
  - [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  - [Prerequisites](#bangbang-prerequisites)
  - [Installation](#gear-installation)
  - [Run Locally](#running-run-locally)
  - [Deployment](#triangular_flag_on_post-deployment)
- [Usage](#eyes-usage)
- [Roadmap](#compass-roadmap)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

<!-- About the Project -->

## :star2: About the Project

<!-- Screenshots -->

### :camera: Screenshots

<div align="center"> 
  <img src="https://i.imgur.com/RqGirXh.png" alt="screenshot" />
  <img src="https://i.imgur.com/CDGSceN.png" alt="screenshot" />
  <img src="https://i.imgur.com/5blD4xl.png" alt="screenshot" />
  <img src="https://i.imgur.com/Vnah9LN.png" alt="screenshot" />
</div>

<!-- TechStack -->

### :space_invader: Tech Stack (for both Client and Server)

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://reactjs.org/">React.js</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://nestjs.com/">Nest.js</a></li>
    <li><a href="https://socket.io/">SocketIO</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.mysql.com/">MySQL</a></li>
    <li><a href="https://www.typeorm.io/">TypeORM (Unfortunately, I started this project before Jakub Król introduced Active Record so I used Data Mapper.)</a></li>
  </ul>
</details>

<!-- Features -->

### :dart: Features (for both Client and Server)

- Synchronized video player
- Synchronized drawing canvas
- Group chat with 'is/are user/s currently typing' notifications
- Upload your own videos and store them in the server (fast-forwarding and sync not supported)
- Profile pics stored in the server
- User list that displays users actions in the room
- Notifications in the app
- Auto delete user and their profile picture on disconnect
- Auto delete room and it's video when all users leave
- Auto delete profile pictures, videos and wipe database on server shutdown

<!-- Getting Started -->

## :toolbox: Getting Started

<!-- Prerequisites -->

### :bangbang: Prerequisites

This project uses npm as package manager

<!-- Run Locally -->

### :running: Run Locally

**IMPORTANT**
- Put https://github.com/GramosTV/ultimate-party-room-server and https://github.com/GramosTV/ultimate-party-room-client in one folder for the shared types to work.
- Always refresh the page on client/server restart/changes, otherwise weird bugs will occur due to websockets.

**Before you start, make sure to create ultimate_party_room mysql database** (typeorm will take care of the tables)

Clone the project

```bash
  git clone https://github.com/GramosTV/ultimate-party-room-client.git
```

Go to the project directory

```bash
  cd ultimate-party-room-client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

<!-- Deployment -->

### :triangular_flag_on_post: Deployment

To deploy this project run

```bash
  npm run build
```

<!-- Roadmap -->

## :compass: Roadmap

- [] Make fast-forwarding for server videos work
- [] Make it look better on all devices (currently looks best in 1080p)

<!-- License -->

## :warning: License

Distributed under the MIT License. See LICENSE.txt for more information.

<!-- Contact -->

## :handshake: Contact

GramosTV - [@discord_handle](GramosTV#2410) - emeraldbob020@gmail.com

Project Link: [https://github.com/GramosTV/ultimate-party-room-client](https://github.com/GramosTV/ultimate-party-room-client)

<!-- Acknowledgments -->

## :gem: Acknowledgements

- [React](https://reactjs.org)
- [Socket.io](https://socket.io)
- [React player](https://github.com/CookPete/react-player)
- [React sketch canvas](https://github.com/vinothpandian/react-sketch-canvas)
- [Formik](https://formik.org)
- [React toastify](https://github.com/fkhadra/react-toastify)
- [Font Awesome](https://fontawesome.com)
- [Animate.css](https://animate.style)
