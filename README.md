# ODO JS SDK

Welcome to the ODO JS SDK. This library is meant for interacting with the ODO app via our JavaScript/App bridge and helps with communication with ODO, recording analytics and saving/retieving data.

## Installation

There are 2 ways to install ODO. 

**via NPM/Yarn**

```
npm install @odogames/js-sdk
// or
yarn add @odogames/js-sdk
```

**Or Download It (save this JS file)**

Use the following link to **download** the ODO JS SDK. Do not hot link to it. We like to make our games **fully operational without the internet**. This allows people to play games on the go more easily.

Download: https://unpkg.com/@odogames/js-sdk@1.0.0/dist/odo.js

## Initialization/Usage

When using npm you should import ODO as follows:

```
import ODO from '@odogames/js-sdk';

const odo = ODO.init({ useLocalStorageInDev: true });
odo.on(ODO.Events.start, () => {});
```

When downloading you should add the script file locally, maybe place it in a vendor file and access the "ODO" variable globally.

```
<script src="vendor/odo.js">
<script>
  const odo = ODO.init({ useLocalStorageInDev: true });
  odo.on(ODO.Events.start, () => {});
</script>
```

## Events

The following functions are available when listening to events.

```
  odo.events.on(event: ODO.Events, callback: (data?: object) => void): void
  odo.events.off(event: ODO.Events, callback: (data?: object) => void): void
  odo.events.once(event: ODO.Events, callback: (data?: object) => void): void
```

### Event Types

**ODO.Events.start**: (Required) Is executed when the player wants to start a game. The `start` event is required to be listened to.

**ODO.Events.restart**: For replayable games, after the "finish" trigger is executed, the player may "restart" the game. This action would initiate a restart event. Optionally, games can implement their own "restart" behavior. This is provided as a convenience.

## Triggers

A trigger is used to signal to ODO that the game is prepared for further player interaction. For instance, the game should fire an `ODO.Triggers.ready` trigger when all assets are loaded.

```
  odo.trigger(event: ODO.Triggers, data?: object): void
```

### Trigger Types

**ODO.Triggers.ready**: (Required) Indicate to ODO that the game is loaded and ready to be played.
**ODO.Triggers.finish**: For replayable games, you can indicate to ODO that a playthrough is complete. This will cause ODO to a show a UI that asks the player if they'd like to replay. This is provided as a convenience.

**NOTE** In dev environments, triggers will automatically fire their "event" counterparts.

## Data Saving/Retrieval

Use the following methods to save/retrieve data. getForPlayer/saveForPlayer are used to store data for just this player, while get/save is for non-player specific information.

```
  odo.data.get(key: string, (data: object) => void): Promise<object>
  odo.data.save(key: string, (data: object) => void): Promise<object>
  odo.data.getForPlayer(key: string, (data: object) => void): Promise<object>
  odo.data.saveForPlayer(key: string, (data: object) => void): Promise<object>
```

## Analytics

You may track certain player activities like "checkpoints" reached in order to get insights into how people playing your game are doing.

```
  odo.track(event: string, data?: object): void
```

## Testing/Configuration

The ODO JS SDK is designed to work within both the ODO app and in local development. When using the app, we save data via ODOs APIs. In local environments (or out on the web elsewhere), we use local storage as the persistence layer. This persistence is volatile, but allows developers to have an easy testing/development experience.

`ODO.init(config?: object)` takes some optional params that are mostly useful in testing scenarios.

```
config = {
  global?: Global, // A simulated global object as defined from our "Global" type. Great for unit testing.
  useLocalStorageInDev: boolean, // Provides a useful simulation of persistance using localStorage
}
```

## Getting Help

If you need any help, please hop into our Discord: https://discord.gg/SDSsGBP
