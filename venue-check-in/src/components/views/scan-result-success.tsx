import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, StyleSheet, Text} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {text, Button, Spacing, useExposure} from '../../external-dependencies';
import {BasicLayout} from '../templates/basic-layout';
import {ScanResult} from '../templates/scan-result';
import {Header} from '../molecules/header';
import * as VisitedVenueStore from '../../services/visited-venue-store';
import Icons from '../../assets/index';
import {matchRiskyVenues} from '../../services/risky-venue-finder';
import {VisitedVenue} from '../../services/common';

export const ScanResultSuccess: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [visitedVenue, setVisitedVenue] = useState<VisitedVenue | null>(null);
  const goToMain = useCallback(() => navigation.navigate('main'), [navigation]);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        goToMain();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [goToMain])
  );

  useEffect(() => {
    const getLastVisitedVenue = async () => {
      const lastVisitedVenue = await VisitedVenueStore.getLastVisitedVenue();
      setVisitedVenue(lastVisitedVenue);
    };

    getLastVisitedVenue();
  }, []);

  const exposure = useExposure();
  useEffect(() => {
    const getVenues = async () => {
      const matches = await matchRiskyVenues();
      if (matches.length > 0) {
        exposure.simulateExposure(20);
      }
    };

    getVenues();
  }, [exposure]);

  const cancelCheckIn = async () => {
    await VisitedVenueStore.removeLastVisitedVenue();
    navigation.goBack();
  };

  return (
    <>
      <Header onClose={goToMain} />
      <BasicLayout>
        <ScanResult
          icon={<Icons.CheckMark width={80} height={80} />}
          content={
            <>
              <Text style={[styles.title, styles.centered]}>
                {t('venueCheckIn:result:success:title')}
              </Text>
              <Spacing s={12} />
              {visitedVenue && (
                <>
                  <Text style={[styles.venue, styles.centered]}>
                    {visitedVenue.venue.name}
                  </Text>
                  <Text style={[styles.venue, styles.centered]}>
                    {visitedVenue.venue.address}
                  </Text>
                </>
              )}
              <Spacing s={26} />
              <Text style={[styles.message, styles.centered]}>
                {t('venueCheckIn:result:success:message')}
              </Text>
            </>
          }
          buttons={
            <>
              <Button width="100%" onPress={goToMain}>
                {t('venueCheckIn:result:success:continueButton')}
              </Button>
              <Spacing s={12} />
              <Button width="100%" type="empty" onPress={cancelCheckIn}>
                {t('venueCheckIn:result:success:cancelButton')}
              </Button>
            </>
          }
        />
      </BasicLayout>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.xlargeBold
  },
  venue: {
    ...text.xlargeBold
  },
  message: {
    ...text.default
  },
  centered: {
    textAlign: 'center'
  }
});
