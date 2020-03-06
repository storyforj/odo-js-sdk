# ODO JS SDK

## Installation

You should never load odo over the wire. Instead either install it via npm or download and store the JS as a vendor file locally.

**via NPM/Yarn**

```
npm install @odogames/js-sdk
// or
yarn add @odogames/js-sdk
```

**Or Download It (save this JS file)**

https://unpkg.com/@odogames/js-sdk@1.0.0/dist/odo.js

## Initialization/Usage

When using npm you should import ODO as follows:

```
import ODO from '@odogames/js-sdk';

const odo = ODO.init();
odo.on(ODO.Events.start, () => {});
```

When downloading you should add the script file locally, maybe place it in a vendor file and access the "ODO" variable globally.

```
<script src="vendor/odo.js">
<script>
  const odo = ODO.init();
  odo.on(ODO.Events.start, () => {});
</script>
```

## APIs

### Functions

```
  // Event Handling (events will only come from ODO)
  odo.on(event: ODO.Events, callback: (data?: object) => void): void
  odo.off(event: ODO.Events, callback: (data?: object) => void): void
  odo.once(event: ODO.Events, callback: (data?: object) => void): void

  // Triggers will be sent to ODO
  odo.trigger(event: ODO.Triggers, data?: object): void

  // Analytics
  odo.track(event: string, data?: object): void

  // Data
  odo.getData(key: string, (data: object) => void): Promise<object>
  odo.saveData(key: string, (data: object) => void): Promise<object>
  odo.getPlayerData(key: string, (data: object) => void): Promise<object>
  odo.savePlayerData(key: string, (data: object) => void): Promise<object>
```

### Events

We have 2 events currently. An event is the way ODO signals to the game that something should occur.

**IMPORTANT** the `start` event is required to be listened to.

- ODO.Events.start: Is executed when the player wants to start a game.
- ODO.Events.restart: For replayable games, after the "finish" trigger is executed, the player may "restart" the game. This action would initiate a restart event. Optionally, games can implement their own "restart" behavior. This is provided as a convenience.

### Triggers

We have 2 triggers currently. A trigger is used for the game to signal to ODO that it is ready to do something. When the game is fullly loaded for instance

**IMPORTANT** the `ready` event is required to be triggered.

- ODO.Triggers.ready: Indicate to ODO that the game is loaded and ready to be played
- ODO.Triggers.finish: For replayable games, you can indicate to ODO that a play through of a game is complete. This will cause ODO to a show a UI to the player that asks them if they'd like to replay. This is provided as a convenience.

### ODO Production vs Testing/Dev

The ODO JS SDK is designed to work within both the ODO app and in local development. When using the app, we save data via ODOs APIs. In local environments (or out on the web elsewhere), we use local storage as the persistence layer. This persistence is volatile, but allows developers to have an easy testing/development experience.

### Getting Help

If you need any help, please hop into our Discord: https://discord.gg/SDSsGBP
