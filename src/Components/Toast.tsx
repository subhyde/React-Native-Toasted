import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

type CustomToastProps = {
  message: string;
  preset: "success" | "error";
  resetToast: () => void;
};

type ContextType = {
  x: number;
  y: number;
};

const screenHeight = Dimensions.get("window").height;

type ToastItem = {
  message: string | null;
  preset: "success" | "error" | null;
};
const Toast: React.FC<CustomToastProps> = ({ message, preset, resetToast }) => {
  const messageQueueRef = useRef<ToastItem[]>([]);
  const [currentToast, setCurrentToast] = useState<ToastItem>({
    message: null,
    preset: null,
  });
  const [resetQueue, setResetQueue] = useState<boolean>(false);
  const y = useSharedValue(-screenHeight);
  const panRef = useRef(null);
  const animation = useRef(null);
  const insets = useSafeAreaInsets();
  const timeoutIdRef = useRef(null);

  const lottieFiles = {
    success: (
      <LottieView
        ref={animation}
        loop={false}
        style={{
          width: 50,
          height: 50,
        }}
        source={require("../Assets/Lotties/checkmark.json")}
      />
    ),
    error: (
      <LottieView
        ref={animation}
        loop={false}
        style={{
          width: 50,
          height: 50,
        }}
        source={require("../Assets/Lotties/error.json")}
      />
    ),
  };

  const panStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: y.value,
        },
      ],
    };
  }, [y]);

  function resetTimeout(timeoutTime: number = 3000) {
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      y.value = withSpring(-200);

      if (messageQueueRef.current.length < 1) {
        messageQueueRef.current = [];
        return;
      }

      setTimeout(() => {
        messageQueueRef.current = messageQueueRef.current.slice(1);
        setCurrentToast({
          message: messageQueueRef.current[0]?.message,
          preset: messageQueueRef.current[0]?.preset,
        });

        //cancel animation
        animation.current?.reset();

        //prevent old messages from staying in state
        if (messageQueueRef.current.length === 0) {
          resetToast();
        }
        setResetQueue(!resetQueue);
      }, 100);
    }, timeoutTime);
  }

  function removeTimeout() {
    clearTimeout(timeoutIdRef.current);
  }

  const playAnimation = () => {
    if (currentToast.preset) {
      animation?.current?.play();
      y.value = withSpring(0, { damping: 100, stiffness: 150 }, () => {});
      resetTimeout();
    }
  };

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, context) => {
      context.y = y.value;
    },
    onActive: (event, context) => {
      if (event.translationY > 0) {
        y.value = 0;
      } else {
        y.value = event.translationY + context.y;
      }
      runOnJS(removeTimeout)();
    },
    onEnd: () => {
      if (y.value < -10) {
        y.value = withSpring(-200);
        runOnJS(removeTimeout)();
        runOnJS(resetTimeout)(200);
      } else if (y.value > -10) {
        y.value = withSpring(0);
        runOnJS(resetTimeout)(1000);
      }
    },
  });

  useEffect(() => {
    if (messageQueueRef.current.length > 0) {
      setTimeout(() => {
        playAnimation();
      }, 500);
    }
  }, [resetQueue]);

  useEffect(() => {
    if (y.value <= -100) {
      playAnimation();
    }
  }, [currentToast]);

  useEffect(() => {
    if (message) {
      const bundle = { message, preset };
      messageQueueRef.current.push(bundle);
      setCurrentToast({
        message: messageQueueRef.current[0].message,
        preset: messageQueueRef.current[0].preset,
      });
    }
  }, [message, preset]);

  return (
    <GestureHandlerRootView
      style={{
        zIndex: 9999999,
        top: insets.top,
        position: "absolute",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PanGestureHandler ref={panRef} onGestureEvent={panGestureEvent}>
        <Animated.View
          style={{
            ...panStyle,
          }}
        >
          <View
            style={{
              width: "60%",
              backgroundColor: "#E5E5E5",
              padding: 1,
              alignSelf: "center",
              borderRadius: 999,
              flexDirection: "row",
              position: "absolute",
            }}
          >
            {lottieFiles[currentToast.preset]}
            <Text
              style={{
                textAlign: "center",
                flex: 1,
                alignSelf: "center",
                flexShrink: 1,
                paddingRight: 3,
              }}
            >
              {currentToast?.message}
            </Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export { Toast };
