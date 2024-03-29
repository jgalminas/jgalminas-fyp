# Nexus - League of Legends Analytics/Recording Application (COMP3000)

## Introduction

League of Legends is a fast-paced online multiplayer game that requires strategy, teamwork and individual skill. Due to its competitive nature, players strive to improve and climb the ladder, however, the complexity and skill ceilling of the game makes it challening. Some players turn to software solutions for assistance, but few are effective. Nexus aims to provide a better solution which helps players learn and improve by providing the necessary tools to analyse, review and learn from their previous matches while automating as many of the processes and features of the application as possible to improve user experience.

## Objectives
### Primary Objectives

1. **Statistics and Analytics** – Provide the user with useful information about their matches and highlights through interactive charts and graphs.

2. **Automatic Recording** – A system which automatically records video and audio when a new match begins ensuring an effort-free and seamless capture of gameplay, which can be rewatched and analysed at a later time.

3. **Event Identification and Highlight Creation** – A feature powered by Artificial Intelligence which analyses the match’s data, identifies the most impactful events and compiles them into video clips reducing the need for players to manually analyse the gameplay of all of their matches.

4. **Recording and Highlight Management** – A user-friendly interface for managing the recorded content and highlights, enabling them to view, edit, and delete the video content.

5. **Manual Highlight Editing and Clipping** – Give users more control over their highlight reel by allowing users to manually capture highlights during the game via a shortcut as well as manually edit game recordings and create their highlights after the game.

### Stretch Objectives
To be implemented if there is additional time.

1. **Social Media Sharing** – Enable users to easily share their highlights on various social media platforms to increase community engagement and indirectly improve player performance.

2. **Cloud Storage** – Allow users to sync their recordings and highlights to the cloud to ensure their media is backed up and can be accessed via multiple devices.

## System Architecture
The system consists of six components which are required to achieve the functionality, some of which are external, such as the League of Legends API and game client, while others are internal.

![System Component Diagram](./readme_assets/component_diagram.png)

## Tools & Technologies

These are some of the main tools and technologies that were used in this project. 

<div style="display: flex; flex-direction: column; gap: 0.5rem;">
  <div style="display: flex; align-items: center;">
    <img alt="React icon" style="height: 3rem; width: 3rem;" src="./readme_assets/react.png">
    <span style="padding-left: 12px;">
      React was used to build the interactive interfaces with ease.
    </span>
  </div>

  <div style="display: flex; align-items: center;">
    <img alt="TypeScript icon" style="height: 3rem; width: 3rem;" src="./readme_assets/typescript.png">
    <span style="padding-left: 12px;">
      TypeScript was the main programming language, used both on client-side and server-side.
    </span>
  </div>
  
  <div style="display: flex; align-items: center;">
    <img alt="Node.js icon" style="height: 3rem; width: 3rem;" src="./readme_assets/nodejs.png">
    <span style="padding-left: 12px;">
      Node.js served as the backbone for both server-side operations and the desktop application.
    </span>
  </div>

  <div style="display: flex; align-items: center;">
    <img alt="Electron icon" style="height: 3rem; width: 3rem;" src="./readme_assets/electron.png">
    <span style="padding-left: 12px;">
      Electron served as a framework for building a desktop application using web technologies.
    </span>
  </div>

  <div style="display: flex; align-items: center;">
    <img alt="Turborepo icon" style="height: 3rem; width: 3rem;" src="./readme_assets/turborepo.png">
    <span style="padding-left: 12px;">
      Turborepo streamlined code reuse and type sharing across the stack.
    </span>
  </div>

  <div style="display: flex; align-items: center;">
    <img alt="MongoDB icon" style="height: 3rem; width: 3rem;" src="./readme_assets/mongodb.png">
    <span style="padding-left: 12px;">
      MongoDB was used to persist dynamic data.
    </span>
  </div>

  <div style="display: flex; align-items: center;">
    <img alt="Python icon" style="height: 3rem; width: 3rem;" src="./readme_assets/python.png">
    <span style="padding-left: 12px;">
      Python was used to create an unsupervised machine learning model for automatic highlight creation.
    </span>
  </div>
</div>

