import { Image, Text, TouchableOpacity, View } from "react-native";
import Slider from '@react-native-community/slider';
import Icon from "react-native-vector-icons/MaterialIcons";
import TrackPlayer, { Event, PlaybackProgressUpdatedEvent, PlaybackTrackChangedEvent, State, useTrackPlayerEvents } from "react-native-track-player";
import { useCallback, useEffect, useState } from "react";
import { formatSeconds } from "../helpers/player";

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
];

const Player = () => {

  const [currentSong, setCurrentSong] = useState<any>({});
  const [playerState, setPlayerState] = useState<null | State>(null)
  const [player, setPlayer] = useState({
    duration: 0,
    position: 0,
  })

  useTrackPlayerEvents(events, (event) => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      setPlayerState(event.state);
    }
  });

  const onPlaybackProgressUpdated = useCallback((event: PlaybackProgressUpdatedEvent) => {
    setPlayer({
      ...player,
      position: Math.round(event.position),
      duration: Math.round(event.duration),
    });
  }, [player]);

  const onPlaybackTrackChanged = useCallback((event: PlaybackTrackChangedEvent) => {
    console.log({ event });
  }, []);


  useEffect(() => {
    const setup = async () => {
      TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, onPlaybackProgressUpdated);
      TrackPlayer.addEventListener(Event.PlaybackTrackChanged, onPlaybackTrackChanged);
      const index = await TrackPlayer.getCurrentTrack();
      const song = await TrackPlayer.getTrack(index);
      setCurrentSong(song);
    }
    setup();
  }, []);


  const pauseSong = useCallback(() => {
    TrackPlayer.pause();
  }, []);

  const playSong = useCallback(() => {
    TrackPlayer.play();
  }, []);

  const skipToPrevious = useCallback(async () => {
    // const index = await TrackPlayer.getCurrentTrack();
    await TrackPlayer.skipToPrevious();
  }, []);

  return (
    <>
      <View className="flex flex-row justify-between mb-10">
        <Icon name="expand-more" size={30} color="#212121" />
        <Text className="font-bold text-xl">Now Playing</Text>
        <Icon name="more-horiz" size={30} color="#212121" />
      </View>
      <View className="items-center">
        <Image className="h-[250px] aspect-[1] rounded-lg mb-5 bg-red-200" source={{ uri: currentSong.artwork }} />
        <Text className="font-bold text-xl">{currentSong.title}</Text>
        <Text className="text-sm mb-5">{currentSong.artist}</Text>
        <Slider
          style={{ width: '90%', height: 40 }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#212121"
          maximumTrackTintColor="#d3d3d3"

        />
        <View className="flex flex-row justify-between mb-10" style={{ width: '90%' }}>
          <Text className="text-[#8e8e8f]">{formatSeconds(player.position)}</Text>
          <Text className="text-[#8e8e8f]">{formatSeconds(player.duration)}</Text>
        </View>
        <View className="flex flex-row items-center">
          <View className="mr-3">
            <Icon name="favorite" size={25} />
          </View>
          <TouchableOpacity className="mr-3" onPress={skipToPrevious}>
            <Icon name="skip-previous" size={50} />
          </TouchableOpacity>
          {
            playerState === State.Playing
            &&
            <TouchableOpacity className="mr-3" onPress={pauseSong}>
              <Icon name="pause-circle-filled" size={60} />
            </TouchableOpacity>
          }
          {
            playerState !== State.Playing
            &&
            <TouchableOpacity className="mr-3" onPress={playSong}>
              <Icon name="play-circle-filled" size={60} />
            </TouchableOpacity>
          }
          <TouchableOpacity className="mr-3" onPress={() => TrackPlayer.skipToNext()}>
            <Icon name="skip-next" size={50} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <Icon name="autorenew" size={25} color="#767678" />
          </TouchableOpacity>
        </View>
        <View className="mt-10">
          <Text className="text-center text-[#bebebf] text-sm">Next:</Text>
          <Text className="text-center text-[#bebebf] text-sm">Song name</Text>
        </View>
      </View>
    </>
  )

};

// TODO: make sure to either use text-xs or text-sm everywhere
// TODO: change slider button to black
// TODO: drop slider shadow

export default Player;