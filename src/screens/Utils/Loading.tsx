import { View, Text, Animated, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { globalStyles } from '../../utils/Constants'

interface Props {
  small?: boolean
  color?: string
}

const Loading: React.FC<Props> = ({ small, color }) => {

  const a = small ? 6 : 8;
  const b = small ? 8 : 10;
  const ha = small ? -3 : -4;
  const hb = small ? -4 : -5;
  const size1 = useRef(new Animated.Value(a)).current;
  const size2 = useRef(new Animated.Value(a)).current;
  const size3 = useRef(new Animated.Value(a)).current;
  const translate1 = useRef(new Animated.Value(ha)).current;
  const translate2 = useRef(new Animated.Value(ha)).current;
  const translate3 = useRef(new Animated.Value(ha)).current;
  const opacity1 = useRef(new Animated.Value(.5)).current;
  const opacity2 = useRef(new Animated.Value(.5)).current;
  const opacity3 = useRef(new Animated.Value(.5)).current;

  useEffect(() => {
    // dot 1
    Animated.loop(Animated.sequence([
      Animated.timing(size1, {
        toValue: b,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(size1, {
        toValue: a,
        duration: 400,
        useNativeDriver: false,
      }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(translate1, {
        toValue: hb,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(translate1, {
        toValue: ha,
        duration: 400,
        useNativeDriver: false,
      }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(opacity1, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(opacity1, {
        toValue: .5,
        duration: 400,
        useNativeDriver: false,
      }),
    ])).start();
    // dot 2
    Animated.sequence([
      Animated.delay(150),
      Animated.loop(Animated.sequence([
        Animated.timing(size2, {
          toValue: b,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(size2, {
          toValue: a,
          duration: 400,
          useNativeDriver: false,
        }),
      ]))
    ]).start();
    Animated.sequence([
      Animated.delay(150),
      Animated.loop(Animated.sequence([
        Animated.timing(translate2, {
          toValue: hb,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(translate2, {
          toValue: ha,
          duration: 400,
          useNativeDriver: false,
        }),
      ]))
    ]).start();
    Animated.sequence([
      Animated.delay(150),
      Animated.loop(Animated.sequence([
        Animated.timing(opacity2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(opacity2, {
          toValue: .5,
          duration: 400,
          useNativeDriver: false,
        }),
      ]))
    ]).start();
    // dot 3
    Animated.sequence([
      Animated.delay(300),
      Animated.loop(Animated.sequence([
        Animated.timing(size3, {
          toValue: b,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(size3, {
          toValue: a,
          duration: 400,
          useNativeDriver: false,
        }),
      ]))
    ]).start();
    Animated.sequence([
      Animated.delay(300),
      Animated.loop(Animated.sequence([
        Animated.timing(translate3, {
          toValue: hb,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(translate3, {
          toValue: ha,
          duration: 400,
          useNativeDriver: false,
        }),
      ]))
    ]).start();
    Animated.sequence([
      Animated.delay(300),
      Animated.loop(Animated.sequence([
        Animated.timing(opacity3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(opacity3, {
          toValue: .5,
          duration: 400,
          useNativeDriver: false,
        }),
      ]))
    ]).start();
  }, [size1, size2, size3]);

  return (
    <View style={[styles.container, { width: small ? 24 : 32 }]}>
      <View style={styles.relative}>
        <Animated.View style={[styles.dot, { backgroundColor: color || globalStyles.colors.primary, opacity: opacity1, width: size1, height: size1, top: translate1, left: translate1 }]}/>
      </View>
      <View style={styles.relative}>
        <Animated.View style={[styles.dot, { backgroundColor: color || globalStyles.colors.primary, opacity: opacity2, width: size2, height: size2, top: translate2, left: translate2 }]}/>
      </View>
      <View style={styles.relative}>
        <Animated.View style={[styles.dot, { backgroundColor: color || globalStyles.colors.primary, opacity: opacity3, width: size3, height: size3, top: translate3, left: translate3 }]}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
  },
  relative: {
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    borderRadius: 20,
  },
});

export default Loading