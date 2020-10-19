import React from 'react';
import {StyleSheet} from 'react-native';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';

interface QRCodeCameraProps {
  cameraRef: any;
  onBarCodeRead: (e: BarCodeReadEvent) => void;
  onStatusChange: (cameraStatus: any) => void;
}

export const QRCodeCamera: React.FC<QRCodeCameraProps> = ({
  cameraRef,
  onBarCodeRead,
  onStatusChange
}) => {
  return (
    <RNCamera
      ref={cameraRef}
      style={styles.preview}
      captureAudio={false}
      type={RNCamera.Constants.Type.back}
      barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      onBarCodeRead={onBarCodeRead}
      onStatusChange={({cameraStatus}) => onStatusChange(cameraStatus)}
    />
  );
};

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});
