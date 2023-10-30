import msgSound from '../assets/sounds/msg_receive.mp3';
import oof from '../assets/sounds/oof.mp3';

export const PlayAudio = async (type) => {
    let audio = null;
    switch (type) {
        case 'msg':
            audio = msgSound;
            break;
        case 'oof':
            audio = oof;
            break;
        default:
            break;
    }
    try {
        const audioFile = new Audio(audio);

        await audioFile.play();
    } catch (error) {
        console.error(error);
    }
}