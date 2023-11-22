import msgSound from '../assets/sounds/msg_receive.mp3';
import oof from '../assets/sounds/oof.mp3';
import door from '../assets/sounds/door.mp3';

export const PlayAudio = async (type) => {
    let audio = null;
    switch (type) {
        case 'msg':
            if (localStorage.getItem('Settings_isGlobalChatSoundActive') === 'false') return;
            audio = msgSound;
            break;
        case 'oof':
            if (localStorage.getItem('Settings_isNotifSoundActive') === 'false') return;
            audio = door;
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