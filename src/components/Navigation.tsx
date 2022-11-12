import { View, Text, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

type NavigationProps = {
  screen: string;
  setScreen: (value: string) => void;
};

const Navigation = ({ screen, setScreen }: NavigationProps) => {
  return (
    <View className="flex pt-2 flex-row justify-around items-center border-t-2 border-[#f1f1f1]">
      <TouchableOpacity onPress={() => { setScreen('search') }}>
        <View className="flex items-center">
          <Icon name="search" size={30} color={ screen === 'search' ? '#212121' : "#989898"} />
          <Text className="text-xs" style={{ color: screen === 'search' ? '#212121' : "#989898" }}>Search</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setScreen('player') }}>
        <View className="flex items-center">
          <Icon name="music-note" size={30} color={ screen === 'player' ? '#212121' : "#989898"} />
          <Text className="text-xs" style={{ color: screen === 'player' ? '#212121' : "#989898" }}>Player</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setScreen('library') }}>
        <View className="flex items-center">
          <Icon name="library-music" size={30} color={ screen === 'library' ? '#212121' : "#989898"} />
          <Text className="text-xs" style={{ color: screen === 'library' ? '#212121' : "#989898" }}>Library</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Navigation;