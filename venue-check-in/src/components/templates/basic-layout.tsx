import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';

import {colors} from '../../external-dependencies';

interface BasicLayoutProps {
  backgroundColor?: string;
  children: React.ReactNode;
}

export const BasicLayout: FC<BasicLayoutProps> = ({
  children,
  backgroundColor
}) => {
  const insets = useSafeArea();

  return (
    <View
      style={[
        styles.container,
        {paddingBottom: insets.bottom + 8},
        !!backgroundColor && {backgroundColor}
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 16,
    paddingHorizontal: 20
  }
});
