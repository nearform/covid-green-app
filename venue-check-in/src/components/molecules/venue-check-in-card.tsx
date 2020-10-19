import React, {forwardRef} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {useTranslation} from 'react-i18next';

import {text, colors, Card} from '../../external-dependencies';

const QRCode = require('../../assets/images/qr-code/qr-code.png');

interface VenueCheckInCardProps {
  onPress?: () => void;
}

export const VenueCheckInCard = forwardRef<any, VenueCheckInCardProps>(
  ({onPress}, ref) => {
    const {t} = useTranslation();

    return (
      <Card cardRef={ref} onPress={onPress} padding={{r: 4}}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <Image
              accessibilityIgnoresInvertColors={false}
              style={styles.imageSize}
              width={styles.imageSize.width}
              height={styles.imageSize.height}
              source={QRCode}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={text.largeBlack}>{t('venueCheckIn:title')}</Text>
            <Text style={[text.smallBold, {color: colors.teal}]}>
              {t('venueCheckIn:subTitle')}
            </Text>
          </View>
        </View>
      </Card>
    );
  }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  icon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  imageSize: {
    width: 64,
    height: 64
  },
  textContainer: {
    flex: 1
  }
});
