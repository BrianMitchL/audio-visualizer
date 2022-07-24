# audio-visualizer

A site to control and display audio visualizers, all from the browser.

See the application at https://brianm.me/audio-visualizer/

The control page allows the user to select an audio device and does the work to
analyze the audio. From this page, the user can also set the active visualizer
to be shown for the given visualizer window.
The visualizer page shows the visualizer.

You should grant access (and remember decision) to the site for
microphone/audio use, and reload the control page in order to see the list of
device names.

## Local Development

Install Node 16+, run `npm install` to install dependencies, and `npm run dev`
to serve a local application. The app runs from the "audio-visualizer" path,
go to `http://localhost:5173/audio-visualizer/` to open it.

## Visualizers

See the visualizer's [documentation](./src/visualizer/visualizers/README.md) for
more info on adding new visualizers.
