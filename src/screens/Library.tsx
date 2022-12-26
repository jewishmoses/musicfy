import { useCallback, useContext, useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, ScrollView } from "react-native";
import TrackPlayer from "react-native-track-player";
import Icon from "react-native-vector-icons/MaterialIcons";
import AppContext from "../contexts/app";
import Song from "../models/Song";

const Library = () => {

  const [songs, setSongs] = useState<any>([]);
  const { setScreen } = useContext(AppContext);

  useEffect(() => {
    const getSongs = async () => {
      const realm = await Realm.open({
        schema: [Song],
        deleteRealmIfMigrationNeeded: true
      });
      const songs = realm.objects("Song");
      setSongs(songs)
    };
    getSongs();
  }, []);

  const playSong = async (song: any) => {
    const track = {
      url: song.file,
      title: song.name,
      artist: song.artist_name,
      artwork: song.image,
    };
    const tracks = songs.map((song: any) => {
      return {
        url: song.file,
        title: song.name,
        artist: song.artist_name,
        artwork: song.image,
      }
    })
    try {
      await TrackPlayer.removeUpcomingTracks();
    } catch (error) {
      console.error(error);
    }
    try {
      await TrackPlayer.remove(0);
    } catch (error) {
      console.error(error);
    }
    await TrackPlayer.add(track);
    await TrackPlayer.add(tracks);
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error(error);
    }
    await TrackPlayer.play();
    setScreen('player');
  };

  const deleteAll = useCallback(async () => {
    const realm = await Realm.open({
      schema: [Song],
      deleteRealmIfMigrationNeeded: true
    });
    realm.write(() => {
      realm.deleteAll();
    });
    setSongs([]);
  }, []);

  return (
    <View>
      <View className="flex flex-row justify-between items-center">
        <TouchableOpacity className="flex flex-row items-center">
          <Icon name="navigate-before" size={30} color="#C52E42" />
          <Text className="text-lg text-[#C52E42]">Library</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-lg text-[#C52E42]">Sort</Text>
        </TouchableOpacity>
      </View>
      <View className="p-2">
        <Text className="text-4xl font-bold mb-4 mt-2">Songs</Text>
        <ScrollView>
          {songs.map(song => {
            return (
              <View key={song.name} className="flex flex-row items-center justify-between mb-2">
                <View className="flex-1 flex flex-row w-full items-center">
                  <TouchableOpacity onPress={() => { playSong(song); }}>
                    <Image className="h-[55px] aspect-[1] rounded-lg mr-3" source={{ uri: song.image }} />
                  </TouchableOpacity>
                  <View className="w-full">
                    <TouchableOpacity onPress={() => { playSong(song); }}>
                      <Text className="text-lg">{song.name}</Text>
                    </TouchableOpacity>
                    <Text className="text-xs text-[#7F7F7F]">{song.artist_name}</Text>
                    <View className="border mt-2 border-[0.5px] border-[#DADADA] border-bottom w-full" />
                  </View>
                  <TouchableOpacity className="ml-auto" onPress={() => { }}>
                    <Icon name="more-horiz" size={25} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}

export default Library;