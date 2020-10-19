import React, {useRef, useState} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {format} from 'date-fns';

import {text, colors} from '../../external-dependencies';
import {TransparentButton} from '../atoms/transparent-button';

const DeleteImage = require('../../assets/images/delete/delete.png');

interface VenueItemProps {
  name: string;
  from: Date;
  to: Date;
  editable?: boolean;
  onDelete: () => void;
}

const formatDate = (date: Date): string => format(date, 'd MMM yyyy HH:mm');

export const VenueItem: React.FC<VenueItemProps> = ({
  name,
  from,
  to,
  onDelete,
  editable = true
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const onDeleteItem = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      setIsVisible(false);
      onDelete();
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      {editable && (
        <View style={styles.buttonContainer}>
          <TransparentButton onPress={onDeleteItem}>
            <Image
              accessibilityIgnoresInvertColors={false}
              style={styles.deleteButton}
              width={styles.deleteButton.width}
              height={styles.deleteButton.height}
              source={DeleteImage}
            />
          </TransparentButton>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>
          {formatDate(from)} - {formatDate(to)}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    opacity: 1,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.white
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 15
  },
  name: {
    ...text.defaultBold,
    paddingBottom: 6
  },
  date: {
    ...text.default
  },
  buttonContainer: {
    justifyContent: 'center'
  },
  deleteButton: {
    width: 26,
    height: 26
  }
});
