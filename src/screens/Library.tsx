import { useCallback, useContext, useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
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
      {songs.map(song => {
        return (<View key={song.name} className="flex flex-row items-center justify-between mb-2">
          <View className="flex flex-row items-center">
            <Image className="h-[75px] aspect-[1] rounded-lg mr-3" source={{ uri: song.image }} />
            <View>
              <Text className="font-bold text-xl">{song.name}</Text>
              <Text className="text-xs">{song.artist_name}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => { playSong(song); }}>
            <Icon name="play-circle-filled" size={30} color="#848485" />
          </TouchableOpacity>
          {/* <Icon name="file-download-done" size={30} color="#848485" /> */}
        </View>)
      })}
      <TouchableOpacity className="flex flex-row items-center" onPress={deleteAll}>
        <Icon name="delete" size={40} />
        <Text className="text-sm">Delete All</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Library;