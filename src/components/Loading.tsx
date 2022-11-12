import React, { useState } from "react";
import { Modal, StyleSheet, View, ActivityIndicator } from "react-native";

type LoadingProps = {
  isLoading: boolean;
};

const Loading = ({ isLoading }: LoadingProps) => {

  return (
    <Modal animationType="slide" transparent={true} visible={isLoading}  >
      <View style={styles.centeredView}>
        <View className="rounded-lg" style={styles.modalView}>
          <ActivityIndicator />
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

export default Loading;