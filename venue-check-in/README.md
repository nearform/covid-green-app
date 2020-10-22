This folder contains the implementation of the Venue check-in and QR code parsing feature.

This README describes the initial configuration steps required to integrate this feature in a COVID app:

- [Initial steps](#initial-steps)
- [Update the react navigation by adding the new `VenueCheckInStack`](#update-the-react-navigation-by-adding-the-new-venuecheckinstack)
- [Add the venue check-in card into the Dashboard](#add-the-venue-check-in-card-into-the-dashboard)
- [Add Venue check-in history into Settings](#add-venue-check-in-history-into-settings)
- [Add translations](#add-translations)

# Initial steps

- Copy the `venue-check-in/` folder into the project.
- Update the import paths in `venue-check-in/src/external-dependencies.tsx`.
- Add the following packages to the `dependencies` section of `package.json`:

  ```JSON
  "@types/jsrsasign": "^8.0.6",
  "@types/jwt-decode": "^2.2.1",
  "jsrsasign": "^10.0.0",
  "jsrsasign-util": "^1.0.0",
  "jwt-decode": "^3.0.0",
  "react-native-aes-crypto": "^1.3.10",
  "react-native-camera": "^3.40.0",
  ```

- Follow the React Native Camera setup steps for iOS: [iOS - other required steps](https://github.com/react-native-camera/react-native-camera/blob/master/docs/installation.md#ios---other-required-steps).

  - Only the `NSCameraUsageDescription` permission is required:

  ```XML
  <key>NSCameraUsageDescription</key>
  <string>This app needs access to your camera in order to check in to venues by scanning official QR codes.</string>
  ```

- Follow the React Native Camera setup steps for Android: [Android - other required steps](https://github.com/react-native-camera/react-native-camera/blob/master/docs/installation.md#android---other-required-steps).

  - Only the `android.permission.CAMERA` permission is required:

  ```XML
  <uses-permission android:name="android.permission.CAMERA" />
  ```

# Update the react navigation by adding the new `VenueCheckInStack`

We need to create a parallel stack for the QR code modal-like screens, so the current configuration must changes to:

```
RootStack
├── AppStack
└── VenueStack
```

To achieve that, create two new stack navigators:

```typescript
const VenueCheckInStack = createStackNavigator();
const RootStack = createStackNavigator();
```

Add the `VenueStack` function that defines the stack for the QR code scanner screens:

```typescript
const VenueStack = () => {
  const {t} = useTranslation();
  return (
    <VenueCheckInStack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        cardStyle: {backgroundColor: colors.black},
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        animationEnabled: true,
        header: () => null
      }}
      initialRouteName={'venueCheckIn.scanner'}
      mode="modal"
      headerMode="none">
      <VenueCheckInStack.Screen
        name="venueCheckIn.scanner"
        component={VenueCodeScanner}
        options={{
          title: t('viewNames:venueCheckIn')
        }}
      />
      <VenueCheckInStack.Screen
        name="venueCheckIn.scanSuccess"
        component={ScanResultSuccess}
        options={{title: t('viewNames:venueCheckIn')}}
      />
      <VenueCheckInStack.Screen
        name="venueCheckIn.scanError"
        component={ScanResultError}
        options={{title: t('viewNames:venueCheckIn')}}
      />

      <VenueCheckInStack.Screen
        name="venueCheckIn.permission"
        component={CameraPermission}
        options={{title: t('viewNames:venueCheckIn')}}
      />
    </VenueCheckInStack.Navigator>
  );
};
```

Take the `Stack.Navigator` inside the `Navigation` function and extract it in its own function (called `AppStack`):

```typescript
const AppStack: React.FC = ({route}) => {
  const {t} = useTranslation();
  const {initialScreen} = route.params;
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        cardStyle: {backgroundColor: 'transparent'},
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationEnabled: true,
        header: (props) => <NavBar {...props} />
      }}
      initialRouteName={initialScreen}
      headerMode="float">
      <Stack.Screen
        name="over16"
        component={Over16}
        options={{
          title: t('viewNames:age'),
          header: () => null,
          cardStyle: {backgroundColor: colors.yellow}
        }}
      />
      <Stack.Screen name="under16" component={Under16} />
      ... ... ...
      <Stack.Screen
        name="terms"
        component={TermsAndConditions}
        options={{title: t('viewNames:terms')}}
      />
    </Stack.Navigator>
  );
};
```

Add the new venue history screen to the settings in `AppStack`:

```typescript
const AppStack: React.FC = ({route}) => {
      ...
      <Stack.Screen
        name="settings.venueHistory"
        component={VenueHistory}
        options={{title: t('viewNames:venueHistory')}}
      />
      ...
    </Stack.Navigator>
  );
};
```

Update the `Navigation` function with the new navigation hierarchy:

```typescript
function Navigation({
  notification,
  exposureNotificationClicked,
  setState
}: {
  traceConfiguration: TraceConfiguration;
  notification: PN | null;
  exposureNotificationClicked: Boolean | null;
  setState: (value: React.SetStateAction<State>) => void;
}) {
  ...
  return (
    <NavigationContainer
      ref={(e) => {
        navigationRef.current = e;
      }}>
      <Spinner animation="fade" visible={app.loading} />
      <RootStack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyle: {backgroundColor: 'transparent'},
          gestureEnabled: true,
          gestureDirection: 'horizontal'
        }}
        headerMode="none"
        mode="modal"
        initialRouteName={'app'}>
        <RootStack.Screen
          name="app"
          component={AppStack}
          initialParams={{initialScreen}}
        />
        <RootStack.Screen name="venueCheckIn" component={VenueStack} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
```

# Add the venue check-in card into the Dashboard

In `src/components/views/dashboard.tsx`, add `VenueCheckInCard` between `<CheckInCard>` and `<QuickCheckIn>`:

```typescript
<VenueCheckInCard onPress={() => navigation.navigate('venueCheckIn')} />
<Spacing s={16} />
```

# Add Venue check-in history into Settings

In `src/components/views/settings/index.tsx` add the configuration object for the new entry:

```typescript
{
  id: 'checkIn',
  ...
},
{
  id: 'venueHistory',
  title: t('settings:venueHistory'),
  label: t('settings:venueHistory'),
  hint: t('settings:venueHistoryHint'),
  screen: 'settings.venueHistory'
},
{
  id: 'privacy',
  ...
```

# Add translations

Add the following translations to `assets/lang/en.json`:

```json
{
  ...
  "venueCheckIn": {
    "title": "Venue check-In",
    "subTitle": "Check in to a venue by scanning an official QR code",
    "scan": {
      "title": "Check in to a venue by scanning an official QR code",
      "description": "Your phone will confirm when the venue has been recognised.",
      "footer": "If you need assistance, please speak to a member of staff at the venue.",
      "authRequired": {
        "title": "Allow camera access",
        "description": "This app needs access to your camera in order to check in to venues by scanning official QR codes.",
        "cancelButton": "Go back",
        "confirmButton": "Allow camera permissions"
      }
    },
    "result": {
      "success": {
        "title": "Successful check-in",
        "message": "Thank you for scanning the QR code.\nYour visit to this venue has been recorded.",
        "continueButton": "Continue",
        "cancelButton": "Cancel this check-in"
      },
      "error": {
        "title": "QR code not recognised",
        "message": "It may not be an official QR code or it could be damaged. Please speak to a member of staff at the venue for assistance.",
        "tryAgainButton": "Try again"
      }
    },
    "history": {
      "title": "Venue History",
      "noVenues": "You haven’t checked in to any venues yet. Once you do, you will be able to view your history and delete individual records here.",
      "editButton": "Edit",
      "deleteAllButton": "Delete all check-in data",
      "alert": {
        "title": "Delete all check-in data",
        "message": "Are you sure you want to delete all of your venue check-in data?",
        "confirmButton": "Delete",
        "cancelButton": "Cancel"
      }
    }
  }
  ...
}
```

And:

```json
"settings": {
  ...
  "venueHistory": "Venue Check-In",
  "venueHistoryHint": "View the Venue Check-In"
},

```

And:

```json
"viewNames": {
  ...
  "venueHistory": "Venue Check-In"
  ...
 }
```
