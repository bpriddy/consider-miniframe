# Consider.js
A mini-framework for building out non-trivial response architecture of conversation apps on Dialogflow leveraging Firebase

[![Build Status](https://travis-ci.org/benoftoolofna/consider-miniframe.svg?branch=master)](https://travis-ci.org/benoftoolofna/consider-miniframe)

## Installation:
1. `npm install localtunnel -g`
2. `npm install considerjs -g`

## Create a Project:
1. Navigate to the project root.
2. `considerjs init`
	1. input project id. Find the project id by navigating to https://console.actions.google.com then selecting the gear icon to the right of the project name on the top left, then selecting 'Project Settings'
	2. input unique project slug for locally hosting firebase during dev
	3. specify Developer access token. Find the access token by navigating to https://console.dialogflow.com then selecting the gear icon to the right of the project name on the top left.
3. `considerjs sync` downloads existing intents, entities and actions, then scaffolds the actions for you.

## Serve the Project
1. `cd functions`
2. `npm run serve`
3. open a new Terminal window in the same folder
4. `npm run localtunnel`
5. set Fulfillment URL to correct locally served firebase functions.
6. ensure that the intents you want served from the webhook have their fulfillment property set correctly.
