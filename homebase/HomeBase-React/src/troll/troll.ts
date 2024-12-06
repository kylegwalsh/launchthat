import { UserStore, NotificationStore } from '../stores';

const users = [
  {
    firstName: 'Bobby',
    lastName: 'Bule',
  },
  {
    firstName: 'Prison',
    lastName: 'Rob',
    picture: 'https://ih0.redbubble.net/image.69481766.1262/ap,550x550,12x16,1,transparent,t.u1.png',
  },
  {
    firstName: 'Data',
    lastName: 'Boi',
    picture: 'http://pinballtokens.com/databoycircle.jpg',
  },
  {
    firstName: 'Lil',
    lastName: 'Rob',
  },
  {
    firstName: 'Robert',
    lastName: 'Rulebert',
  },
  {
    firstName: 'Deep',
    lastName: 'Salmon',
    picture: 'https://ccmarketplace.azureedge.net/cc-temp/listing/92/2501/4058454-1971-chevrolet-chevelle-ss-thumb.jpg',
  },
  {
    firstName: 'Mansion',
    lastName: 'Owner',
    picture: 'https://cdn.vox-cdn.com/thumbor/noKwnIH3Fg2WzTqsRLyWedbhXc0=/0x0:1486x986/1200x800/filters:focal(614x129:850x365)/cdn.vox-cdn.com/uploads/chorus_image/image/59450083/gable1.0.jpg',
  },
  {
    firstName: 'Data',
    lastName: 'Boi',
    picture: 'http://pinballtokens.com/databoycircle.jpg',
  },
];

/**
 * This is a very important script
 */
export const getTrollUser = () => {
  if (UserStore.user && UserStore.user.troll) {
    const index = Math.floor(Math.random() * users.length);
    return users[index];
  }
};

/**
 * Is that an air horn?
 */
export const randomNoise = () => {
  setTimeout(() => {
    if (UserStore.user && UserStore.user.troll) {
      document.addEventListener('click', () => {
        const dice = Math.random();

        if (dice < .05) {
          const snd = new Audio(`${process.env.PUBLIC_URL}/audio/horn.wav`);
          snd.play();
        }
      });
    }
  }, 3000);
};

/**
 * Good for you
 */
export const successNoise = () => {
  if (UserStore.user && UserStore.user.troll) {
    const snd = new Audio(`${process.env.PUBLIC_URL}/audio/cheer.wav`);
    snd.play();
  }
};

/**
 * You goofed
 */
export const errorNoise = () => {
  if (UserStore.user && UserStore.user.troll) {
    const snd = new Audio(`${process.env.PUBLIC_URL}/audio/boo.wav`);
    snd.play();
  }
};

/**
 * Mr. stark...
 */
const IDontFeelSoGood = (currentOpacity: number) => {
  const newOpacity = currentOpacity - .02;
  console.log(newOpacity);
  const screen = document.getElementById('root');
  console.log(screen);
  if (screen && screen.style) {
    console.log(screen.style);
    screen.style.opacity = `${newOpacity}`;
    setTimeout(() => IDontFeelSoGood(newOpacity), 20000);
  }
};

/**
 * The great equalizer
 */
export const thanosSnap = () => {
  setTimeout(() => {
    if (UserStore.user && UserStore.user.troll) {
      IDontFeelSoGood(1);
    }
  }, 3000);
};

/**
 * You already know what time it is
 */
export const snackTime = () => {
  setTimeout(() => {
    if (UserStore.user && UserStore.user.troll) {
      const date = new Date();
      const hour = date.getHours();

      if (hour > 12) NotificationStore.addNotification('info', 'The snacks are out', 'Hey you...');
    }
  }, 3000);
};