import TrackPlayer, { Event, State } from "react-native-track-player";

// let wasPausedByDuck = false;

export default async () => {

    TrackPlayer.addEventListener(Event.RemotePause, () => { TrackPlayer.pause(); });
    TrackPlayer.addEventListener(Event.RemotePlay, () => { TrackPlayer.play(); });
    TrackPlayer.addEventListener(Event.RemoteNext, () => { TrackPlayer.skipToNext(); });
    TrackPlayer.addEventListener(Event.RemotePrevious, () => { TrackPlayer.skipToPrevious(); });
    TrackPlayer.addEventListener(Event.RemoteSeek, event => { TrackPlayer.seekTo(event.position); });

    TrackPlayer.addEventListener(Event.RemoteJumpForward, async event => {
        console.log("Event.RemoteJumpForward", event);
        const position = (await TrackPlayer.getPosition()) + event.interval;
        TrackPlayer.seekTo(position);
    });

    TrackPlayer.addEventListener(Event.RemoteJumpBackward, async event => {
        console.log("Event.RemoteJumpBackward", event);
        const position = (await TrackPlayer.getPosition()) - event.interval;
        TrackPlayer.seekTo(position);
    });

    // TrackPlayer.addEventListener(Event.RemoteDuck, async ({ permanent, paused }) => {
    //     console.log("Event.RemoteDuck");
    //     if (permanent) {
    //         TrackPlayer.pause();
    //         return;
    //     }
    //     if (paused) {
    //         const playerState = await TrackPlayer.getState();
    //         wasPausedByDuck = playerState !== State.Paused;
    //         TrackPlayer.pause();
    //     } else {
    //         if (wasPausedByDuck) {
    //             TrackPlayer.play();
    //             wasPausedByDuck = false;
    //         }
    //     }
    // });

    // TODO: handle pause by duck
}