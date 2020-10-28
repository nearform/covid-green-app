import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Alert, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';

import {text, colors, Button, Heading} from '../../external-dependencies';
import {VenueItem} from '../molecules/venue-item';
import {TransparentButton} from '../atoms/transparent-button';
import {BasicLayout} from '../templates/basic-layout';
import * as VisitedVenueStore from '../../services/visited-venue-store';
import {stringToDate} from '../../services/date-utils';
import {VisitedVenue} from '../../services/common';

const ItemSeparator: React.FC = () => <View style={itemStyles.item} />;

const itemStyles = StyleSheet.create({
  item: {
    height: 1,
    backgroundColor: colors.lightGray
  }
});

export const VenueHistory: React.FC = () => {
  const {t} = useTranslation();
  const [visitedVenues, setVisitedVenues] = useState<VisitedVenue[]>([]);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  useEffect(() => {
    const getLastVisitedVenue = async () => {
      const venues = await VisitedVenueStore.getVisitedVenues();
      setVisitedVenues(venues);
    };

    getLastVisitedVenue();
  }, []);

  const onDelete = async (index: number) => {
    const newVenues = await VisitedVenueStore.deleteVenue(index);
    setVisitedVenues(newVenues);
  };

  const deleteAllAlert = (onDeleteAll: () => {}) => {
    Alert.alert(
      t('venueCheckIn:history:alert:title'),
      t('venueCheckIn:history:alert:message'),
      [
        {
          text: t('venueCheckIn:history:alert:cancelButton'),
          style: 'cancel'
        },
        {
          text: t('venueCheckIn:history:alert:confirmButton'),
          onPress: onDeleteAll
        }
      ],
      {cancelable: false}
    );
  };

  const onDeleteAll = () => {
    deleteAllAlert(async () => {
      const newVenues = await VisitedVenueStore.deleteAllVenues();
      setVisitedVenues(newVenues);
    });
  };

  const noVenues = visitedVenues.length === 0;
  return (
    <BasicLayout>
      <View style={styles.header}>
        <View style={styles.headerWrapper}>
          <Heading text={t('venueCheckIn:history:title')} />
        </View>
        {!noVenues && (
          <TransparentButton
            label={t('venueCheckIn:history:editButton')}
            onPress={() => setIsEditable(!isEditable)}
          />
        )}
      </View>
      {noVenues ? (
        <Text style={styles.noVenues}>
          {t('venueCheckIn:history:noVenues')}
        </Text>
      ) : (
        <FlatList
          data={visitedVenues}
          keyExtractor={(item) => `${item.venue.id}-${item.from}-${item.to}`}
          renderItem={({item, index}) => (
            <VenueItem
              key={index}
              editable={isEditable}
              name={item.venue.name}
              from={stringToDate(item.from)}
              onDelete={() => onDelete(index)}
            />
          )}
          ItemSeparatorComponent={() => <ItemSeparator />}
          contentContainerStyle={styles.venueList}
        />
      )}
      {isEditable && !noVenues && (
        <View style={styles.buttonContainer}>
          <Button width="100%" type="danger" onPress={onDeleteAll}>
            {t('venueCheckIn:history:deleteAllButton')}
          </Button>
        </View>
      )}
    </BasicLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row'
  },
  headerWrapper: {
    flex: 1
  },
  venueList: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  buttonContainer: {
    paddingTop: 8
  },
  noVenues: {
    ...text.default
  }
});
