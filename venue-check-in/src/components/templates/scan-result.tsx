import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {text, colors, Spacing} from '../../external-dependencies';

interface ScanResultProps {
  content: any;
  image: any;
  buttons: any;
}

export const ScanResult: React.FC<ScanResultProps> = ({
  content,
  image,
  buttons
}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Spacing s={36} />
        <Image
          accessibilityIgnoresInvertColors={false}
          style={styles.iconSize}
          width={styles.iconSize.width}
          height={styles.iconSize.height}
          source={image}
        />
        <Spacing s={36} />
        {content}
      </ScrollView>
      {buttons}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white
  },
  scrollView: {
    flex: 1,
    alignItems: 'center'
  },
  iconSize: {
    width: 80,
    height: 80
  },
  title: {
    ...text.xxlargeBlack,
    textAlign: 'center'
  },
  venueInfo: {
    ...text.default,
    textAlign: 'center'
  }
});
