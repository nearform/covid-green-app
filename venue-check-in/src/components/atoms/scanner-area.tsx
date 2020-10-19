import React from 'react';
import {StyleSheet, View} from 'react-native';

export const ScannerArea: React.FC = () => {
  return (
    <View style={styles.scannerArea}>
      <View style={styles.scanner} />
    </View>
  );
};

const styles = StyleSheet.create({
  scannerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scanner: {
    width: '100%',
    height: '100%',
    borderColor: 'rgba(0, 0, 0, .8)',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 20,
    borderRightWidth: 20
  }
});
