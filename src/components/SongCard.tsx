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
      if(songExists) return;
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
    <View className="flex flex-row items-center justify-between mb-2">
      <Progress inProgress={isDownloading} progress={downloadProgress} />
      <View className="flex flex-row items-center">
        <Image className="h-[75px] aspect-[1] rounded-lg mr-3" source={{ uri: song.album.images[0].url }} />
        <View>
          <Text className="font-bold text-xl">{song.name}</Text>
          <Text className="text-xs">{song.artists[0].name}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={downloadSong}>
        <Icon name="file-download" size={30} color="#848485" />
      </TouchableOpacity>
      {/* <Icon name="file-download-done" size={30} color="#848485" /> */}
    </View>
  )
}

export default SongCard;