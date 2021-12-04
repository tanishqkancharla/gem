// A file for initial content loading into the document. Checks if we're on about page or not, and returns the appropriate content

const welcomes = [
  "What's on your mind?",
  "Hey, welcome to Gem :)",
  "Hello, hello!",
  "Why, welcome.",
  "A long, long time ago...",
  "Go ahead, try me >:)",
  "Just type it out.",
];
const about = `Hello! Welcome to Gem. Gem is a light-weight, performant, and minimal editor designed to be aesthetic and fun. 

It's entirely local: your notes don't get sent anywhere, and if you close the tab, they're gone forever.

It's being developed by [Tanishq Kancharla](https://moonrise.tk) (me!) and open-sourced on [Github](https://github.com/moonrise-tk/gem). Have a look at the README for more information.

Please reach out to me if you like Gem, or have any ideas for features!

`;
export const initalContent =
  window.location.pathname === "/about"
    ? about
    : welcomes[Math.floor(Math.random() * welcomes.length)];
