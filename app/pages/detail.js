import React from 'react';
import { View, Text } from 'react-native';

const DetailScreen = ({ route }) => {
  const { claimedText } = route.params;

  console.log(claimedText)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {claimedText.map((message, index) => (
        <Text key={index}>{message}</Text>
      ))}
    </View>
  );
};

export default DetailScreen;
