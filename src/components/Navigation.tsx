import { View, Text, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

type NavigationProps = {
  screen: string;
  setScreen: (value: string) => void;
};

const Navigation = ({ screen, setScreen }: NavigationProps) => {
  return (
    <View className="flex pt-2 flex-row justify-around items-center border-t-2 border-[#f1f1f1]">
      <TouchableOpacity onPress={() => { }}>
        <View className="flex items-center">
          <Icon name="ios-play-circle" size={30} color={screen === 'player' ? '#E03C4A' : "#959595"} />
          <Text className="text-xs" style={{ color: screen === 'player' ? '#E03C4A' : "#959595" }}>Player</Text>
        </View>
      </TouchableOpacity>
      {/* todo: add missing icon here */}
      <TouchableOpacity onPress={() => { }}>
        <View className="flex items-center">
          <Icon name="ios-radio" size={30} color={screen === 'radio' ? '#E03C4A' : "#959595"} />
          <Text className="text-xs" style={{ color: screen === 'radio' ? '#E03C4A' : "#959595" }}>Radio</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setScreen('library') }}>
        <View className="flex items-center">
          <Icon name="ios-albums" size={30} color={screen === 'library' ? '#E03C4A' : "#959595"} />
          <Text className="text-xs" style={{ color: screen === 'library' ? '#E03C4A' : "#959595" }}>Library</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setScreen('search') }}>
        <View className="flex items-center">
          <Icon name="search" size={30} color={screen === 'search' ? '#E03C4A' : "#959595"} />
          <Text className="text-xs" style={{ color: screen === 'search' ? '#E03C4A' : "#959595" }}>Search</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Navigation;