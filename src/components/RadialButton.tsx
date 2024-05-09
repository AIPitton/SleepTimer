import {
  View,
  Text,
  Animated,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import React from 'react'
import Svg, { G, Circle } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedInput = Animated.createAnimatedComponent(TextInput)

const RadialButton = () => {
  const radius = 120
  const strokeWidth = 30
  const color = 'tomato'
  const percentage = 99
  const halfCircle = radius + strokeWidth
  const circleCircumference = 2 * Math.PI * radius
  const circleRef = React.useRef()
  const max = 100
  const delay = 500
  const textColor = 'green'
  const inputRef = React.useRef()
  const duration = 500
  const animatedValue = React.useRef(new Animated.Value(0)).current
  const animation = (toValue: any) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay,
      useNativeDriver: true,
    }).start(() => {
      animation(toValue === 0 ? percentage : 0)
    })
  }
  React.useEffect(() => {
    animation(percentage)

    animatedValue.addListener((v) => {
      if (circleRef?.current) {
        const maxPercentage = (100 * v.value) / max
        const strokeDashoffset =
          circleCircumference - (circleCircumference * maxPercentage) / 100
        circleRef.current.setNativeProps({
          strokeDashoffset,
        })
      }
      if (inputRef?.current) {
        inputRef.current.setNativeProps({
          text: `${Math.round(v.value)}`,
        })
      }
    })
    return () => {
      animatedValue.removeAllListeners()
    }
  }, [max, percentage])
  return (
    <View className="w-screen h-screen items-center justify-center">
      <View className="flex items-center justify-center">
        <TouchableOpacity onPress={() => console.log('Start')}>
          <Text className="text-3xl font-bold">START</Text>
        </TouchableOpacity>
      </View>
      <View className="flex items-center justify-center">
        <Svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
        >
          <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
            <Circle
              cx="50%"
              cy="50%"
              stroke={color}
              strokeWidth={strokeWidth}
              r={radius}
              strokeOpacity={0.2}
              fill="transparent"
            />

            <AnimatedCircle
              ref={circleRef}
              cx="50%"
              cy="50%"
              stroke={color}
              strokeWidth={strokeWidth}
              r={radius}
              fill="transparent"
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference}
              strokeLinecap="round"
            />
          </G>
        </Svg>

        <AnimatedInput
          ref={inputRef}
          underlineColorAndroid="transparent"
          editable={false}
          defaultValue="0"
          style={[
            StyleSheet.absoluteFillObject,
            { fontSize: radius / 2, color: textColor ?? color },
            { fontWeight: '900', textAlign: 'center' },
          ]}
        />
      </View>
    </View>
  )
}

export default RadialButton
