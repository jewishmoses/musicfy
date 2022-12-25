import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Loading from "../components/Loading";
import SongCard from "../components/SongCard";
import AppContext from "../contexts/app";
import Icon from 'react-native-vector-icons/MaterialIcons';

const Search = () => {

  const search = useRef(null);
  const [query, setQuery] = useState<string>("Hello");
  const { token } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!query) return;
      const t = await searchSong();
      setSongs(t);
    }, 1000)
    return () => clearTimeout(getData);
  }, [query])

  const searchSong = useCallback(async () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.5");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br");
    myHeaders.append("Authorization", `Bearer ${token}`);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    let response
    try {
      response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, requestOptions)
      response = await response.json()
    } catch (error) {
      console.log('error', error);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    return response.tracks.items;
  }, [query]);

  const clearQuery = useCallback(() => {
    search.current.clear();
    search.current.focus();
  }, [search]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <View className="flex flex-row">
        <View className="items-center flex-1 flex flex-row p-2 mb-5 rounded-lg bg-[#f8f8f8]">
          <Icon name="search" size={30} color="#747476" />
          <TextInput returnKeyType="done" ref={search} className="ml-2 text-left rounded text-[#000] w-full text-sm mr-auto" placeholder="Artists, Songs, Lyrics, an.." onChangeText={setQuery} />
          <Icon onPress={clearQuery} name="cancel" size={25} color="#747476" />
        </View>
        <TouchableOpacity onPress={() => { }}>
          <Text className="p-2 text-[#C52E42] text-center text-lg">Cancel</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {songs.map(song => <SongCard key={song.id} song={song} />)}
      </ScrollView>
    </>
  )
};

export default Search;