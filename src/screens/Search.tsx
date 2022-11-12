import { useCallback, useContext, useEffect, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import Loading from "../components/Loading";
import SongCard from "../components/SongCard";
import AppContext from "../contexts/app";

const Search = () => {

  const [query, setQuery] = useState<string>("Hello");
  const { token } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!query) return;
      const t = await searchSong();
      setSongs(t);
    }, 500)
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

  return (
    <>
      <Loading isLoading={isLoading} />
      <TextInput className="p-3 mb-5 font-bold rounded bg-[#f8f8f8]" placeholder="Search" onChangeText={setQuery} />
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {songs.map(song => <SongCard key={song.id} song={song} />)}
      </ScrollView>
    </>
  )
};

export default Search;