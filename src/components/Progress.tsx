import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Bar } from "react-native-progress";

type ProgressProps = {
  progress: number;
  inProgress: boolean;
};

const Progress = ({ inProgress, progress }: ProgressProps) => {
  return (
    <Modal animationType="slide" transparent={true} visible={inProgress}>
      <View style={styles.centeredView}>
        <View className="rounded-lg" style={styles.modalView}>
          <Bar color="#212121" indeterminate={progress === 0} progress={progress} width={200} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

// TODO: move styles to classes

export default Progress;