import reqSound from "../../sounds/request-sound-effect.mp3";
import chatSound from "../../sounds/chat.mp3";
export const playSound = () => {
  const audio = new Audio(reqSound);
  audio.play();
};

export const playChatSound = () => {
  const audio = new Audio(chatSound);
  audio.play();
};
