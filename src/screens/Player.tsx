import { Image, SafeAreaView, Text, TouchableOpacity, View, PanResponder, Animated, StyleSheet } from "react-native";
import Slider from '@react-native-community/slider';
import Icon from "react-native-vector-icons/Ionicons";
import TrackPlayer, { Event, PlaybackProgressUpdatedEvent } from "react-native-track-player";
import { useCallback, useEffect, useState, useRef, useContext } from "react";
import { formatSeconds } from "../helpers/player";
import ImageColors from 'react-native-image-colors'
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';
import { Dimensions } from 'react-native';
import AppContext from '../contexts/app';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const swipeThreshold = screenHeight - screenWidth + 10;

const Player = () => {

  const [track, setTrack] = useState<any>({});
  const [player, setPlayer] = useState({
    duration: 0,
    position: 0,
  });
  const [playbackState, setPlaybackState] = useState<string>();
  const [colors, setColors] = useState<string[]>(["#65656B", "#65656B", "#65656B", "#65656B", "#222222"]);
  const swipeDownProgress = useRef(new Animated.Value(0)).current;
  const animatedStyle = {
    transform: [{ translateY: swipeDownProgress }],
  };
  const { setScreen } = useContext(AppContext);

  const getColor = (hex: string) => {
    let color = Color(hex)
    if (color.lightness() > 80) {
      color = color.darken(0.5).blacken(0.5);
    }
    if (color.lightness() < 20) {
      color = Color("#222222");
    }
    return color.saturate(0.1).lighten(0.1).hex();
  };

  // useTrackPlayerEvents(events, (event) => {
  //   if (event.type === Event.PlaybackError) {
  //     console.warn('An error occured while playing the current track.');
  //   }
  //   if (event.type === Event.PlaybackState) {
  //     setPlayerState(event.state);
  //   }
  // });

  const onPlaybackProgressUpdated = (event: PlaybackProgressUpdatedEvent) => {
    setPlayer({
      ...player,
      position: Math.round(event.position),
      duration: Math.round(event.duration),
    });
  };

  useEffect(() => {
    const setup = async () => {
      TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, onPlaybackProgressUpdated);
      TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
        setPlaybackState(event.state);
      })
      // todo: figure out what the below code does & improve it
      const index = await TrackPlayer.getCurrentTrack();
      const t = await TrackPlayer.getTrack(index);
      setTrack(t);
    }
    setup();
  }, [playbackState]);

  useEffect(() => {
    const initBackgroundColor = async () => {
      if (!track.artwork) return
      const result: any = await ImageColors.getColors(track.artwork, { // todo: fix any type
        cache: true,
        key: 'unique_key',
        quality: 'high',
      })
      const color = getColor(result.background);
      setColors([color, color, color, color, "#222222"])
    };
    initBackgroundColor();
  }, [track]);

  const panResponderRef = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dy) > 10 && gestureState.dy > 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      swipeDownProgress.setValue(gestureState.dy);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > screenHeight - swipeThreshold) {
        swipeDownProgress.setValue(screenHeight - swipeThreshold);
        setScreen('library');
        return;
      }
      swipeDownProgress.setValue(0);
    },
  })).current;

  const onSeek = useCallback((position: number) => {
    TrackPlayer.seekTo(position);
  }, []);

  return (
    <Animated.View
      {...panResponderRef.panHandlers}
      style={[animatedStyle, StyleSheet.absoluteFill]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <View className="h-full">
            <View className="flex flex-row justify-center mb-7 mt-3">
              <View className="rounded h-[5px] w-[40px] bg-[#fff] opacity-20" />
            </View>
            <View className="items-center mb-5" style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.48,
              shadowRadius: 11.95,
              elevation: 18,
            }}>
              {/* // todo: either use classes or react native stylesheet */}
              <Image className="h-[230px] h-[325px] aspect-[1] rounded-lg mb-5 bg-[#65656B]" source={{ uri: track.artwork }} />
            </View>
            <View className="mx-4 flex flex-row justify-between items-center">
              <View>
                <Text className="font-bold text-2xl text-[#F0F0F0]" numberOfLines={1} ellipsizeMode="tail">{track.title}</Text>
                {/* todo: make sure text will spin in place, like in apple music player */}
                <Text className="text-xl text-white opacity-50">{track.artist}</Text>
              </View>
              <TouchableOpacity className="flex justify-center items-center rounded-full p-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', }}>
                <Icon name="ios-ellipsis-horizontal" color="#fff" size={20} />
              </TouchableOpacity>
            </View>
            <View className="mx-4">
              <Slider
                style={{ width: '100%', opacity: 0.5 }}
                minimumValue={0}
                maximumValue={player.duration}
                value={player.position}
                onSlidingComplete={onSeek}
                minimumTrackTintColor={"#fff"}
                maximumTrackTintColor={"#b6b6b6"}
              />
              <View className="flex flex-row justify-between w-full">
                <Text className="text-white opacity-30">{formatSeconds(player.position)}</Text>
                <Text className="text-white opacity-30">{formatSeconds(player.duration)}</Text>
              </View>
            </View>
            <View className="mt-2 flex flex-row justify-center items-center">
              <TouchableOpacity className="mr-5" onPress={() => { }}>
                <Icon name="ios-play-back" size={45} color="#fff" />
              </TouchableOpacity>
              {
                playbackState === "playing"
                  ?
                  <TouchableOpacity className="mx-10" onPress={() => { TrackPlayer.pause() }}>
                    <Icon name="ios-pause" size={60} color="#fff" />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity className="mx-10" onPress={() => { TrackPlayer.play() }}>
                    <Icon name="ios-play" size={60} color="#fff" />
                  </TouchableOpacity>
              }
              <TouchableOpacity className="ml-5" onPress={() => { }}>
                <Icon name="ios-play-forward" size={45} color="#fff" />
              </TouchableOpacity>
            </View>
            <View className="mt-8 flex justify-center flex-row items-center px-10">
              <Icon name="ios-volume-off" size={25} color="#fff" style={{ opacity: 0.7 }} />
              <Slider
                style={{ width: '100%', opacity: 0.5 }}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={"#fff"}
                maximumTrackTintColor={"#b6b6b6"}
              />
              <Icon name="ios-volume-high" size={25} color="#fff" style={{ opacity: 0.7 }} />
            </View>
            <View className="mt-auto flex flex-row justify-center">
              <TouchableOpacity>
                <Icon name="ios-chatbox-outline" size={25} color="#fff" style={{ opacity: 0.7 }} />
              </TouchableOpacity>
              <TouchableOpacity className="mx-20">
                <Icon name="ios-radio" size={25} color="#fff" style={{ opacity: 0.7 }} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="ios-list" size={25} color="#fff" style={{ opacity: 0.7 }} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  )

};

export default Player;