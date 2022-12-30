import { View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import Player from "./src/screens/Player";
import Search from "./src/screens/Search";
import Navigation from "./src/components/Navigation";
import { useEffect, useState } from "react";
import TrackPlayer, { Capability } from "react-native-track-player";
import Library from "./src/screens/Library";
import AppContext from "./src/contexts/app";

const App = () => {

  const [screen, setScreen] = useState('search');
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 1,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo
        ],
      },)
    };
    setupPlayer();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      if (token) return;
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      let response;
      try {
        response = await fetch("https://musicfy.nymz.dev/songs/token", requestOptions)
        response = await response.json();
      } catch (error) {
        console.log('error', error)
        return;
      }
      if (response.success === false) return;
      setToken(response.data.token);
    };
    getToken();
  }, [token]);

  const context = {
    setScreen,
    token, setToken,
  };

  const Screen = () => {
    switch (screen) {
      case 'search':
        return <Search />
      case 'library':
        return <Library />
      default:
        return <Library />
    }
  }

  return (
    <AppContext.Provider value={context}>
      <View className="bg-[#fdfdfe]" style={StyleSheet.absoluteFill}>
        <SafeAreaView>
          <View className="h-full w-full">
            <ScrollView className="p-2" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
              <Screen />
            </ScrollView>
            <Navigation screen={screen} setScreen={setScreen} />
          </View>
        </SafeAreaView>
      </View>
      {screen === 'player' ? <Player /> : <></>}
    </AppContext.Provider>
  );
};

export default App;
