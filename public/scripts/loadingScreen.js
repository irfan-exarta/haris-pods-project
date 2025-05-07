import * as pc from 'playcanvas';

export function LoadingScreen(app) {
  const div = document.createElement('div');
  div.style.backgroundColor = '#232323'; // Dark gray background
  div.style.position = 'absolute';
  div.style.top = '0';
  div.style.left = '0';
  div.style.height = '100%';
  div.style.width = '100%';
  document.body.appendChild(div);

  // Create the progress bar div, centered on the screen
  const progressBar = document.createElement('div');
  progressBar.style.position = 'absolute';
  progressBar.style.top = '50%';
  progressBar.style.left = '25%';
  progressBar.style.transform = 'translateY(-50%)';
  progressBar.style.width = '50%';
  progressBar.style.height = '20px';
  progressBar.style.backgroundColor = '#d3d3d3'; // Light gray for the bar background
  div.appendChild(progressBar);

  // Create the filler for the progress bar
  const progressFiller = document.createElement('div');
  progressFiller.style.height = '100%';
  progressFiller.style.backgroundColor = '#4caf50'; // Green for the progress
  progressFiller.style.width = '0%';
  progressBar.appendChild(progressFiller);

  // Update the progress bar on preload progress
  app.on('preload:progress', (value) => {
    progressFiller.style.width = value * 100 + '%';
  });
  app.once('preload:end', () => {
    app.off('preload:progress');
  });

  // Hide the loading screen when the app starts
  app.once('start', () => {
    document.body.removeChild(div);
  });
}
