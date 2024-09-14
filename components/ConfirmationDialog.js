import React from "react";
import { StyleSheet } from "react-native";
import { Dialog, Portal, Button, Text } from "react-native-paper";

const ConfirmationDialog = ({
  visible,
  onDismiss,
  onConfirm,
  title,
  content,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.content}>{content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>БОЛИХ</Button>
          <Button onPress={onConfirm}>ТИЙМ</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: "#ffffff", // Set background to white
  },
  title: {
    textAlign: "center",
  },
  content: {
    textAlign: "center",
  },
});

export default ConfirmationDialog;
