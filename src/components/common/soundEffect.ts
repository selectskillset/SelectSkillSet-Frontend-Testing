import reqSound from "../../sounds/request-sound-effect.mp3"
export const playSound = () => {
    const audio = new Audio(reqSound); 
    audio.play();
  };
  