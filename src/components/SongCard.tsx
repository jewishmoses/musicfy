import { View, Image, Text, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import Realm from "realm";
import Song from "../models/Song";
import { useState } from "react";
import Progress from "./Progress";
import RNFetchBlob from "rn-fetch-blob";

type SongCardProps = {
  song: any; // TODO: create song type
};

const SongCard = ({ song }: SongCardProps) => {

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const createSong = async (path: string) => {
    const realm = await Realm.open({
      schema: [Song],
      deleteRealmIfMigrationNeeded: true,
    });
    realm.write(() => {
      const songExists = realm.objectForPrimaryKey("Song", song.id) !== null;
      if (songExists) return;
      realm.create("Song", {
        name: song.name,
        artist_name: song.artists[0].name,
        image: song.album.images[0].url,
        file: path,
        id: song.id,
      });
    });
  };

  const downloadSong = async () => {
    setIsDownloading(true);
    const path = `${RNFS.DocumentDirectoryPath}/${song.id}.mp3`;
    RNFetchBlob
      .config({ path })
      .fetch('GET', `https://musicfy.nymz.dev/songs/${song.id}`)
      .progress((received, total) => {
        let progressPercent = (received / total);
        setDownloadProgress(progressPercent);
        if (progressPercent === 100) {
          setIsDownloading(false);
        }
      })
      .then(async () => {
        setIsDownloading(false);
        setDownloadProgress(0);
        await createSong(path);
      })
      .catch((errorMessage, statusCode) => {
        console.error({ errorMessage });
        // tell the user there has been an error with downloading...
        setIsDownloading(false);
        setDownloadProgress(0);
      })
  };

  return (
    <View>
      <View className="flex flex-row items-center justify-between mb-2">
        <Progress inProgress={isDownloading} progress={downloadProgress} />
        <TouchableOpacity onPress={downloadSong}>
          <View className="flex flex-row items-center">
            <Image className="p-2 h-[60px] aspect-[1] rounded-lg mr-3" source={{ uri: song.album.images[0].url }} />
            <View>
              <Text className="text-lg">{song.name}</Text>
              <Text className="text-xs text-[#888988]">{song.artists[0].name}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }}>
          <Icon name="more-horiz" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View className="mb-2 border border-[#E4E4E4] w-full border-[0.5px]" />
    </View>
  )
}

export default SongCard;