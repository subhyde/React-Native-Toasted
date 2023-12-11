import { View } from "react-native";
import { ToastProvider } from "./src/Context/ToastContext";
import ToastPreview from "./src/Views/ToastPreview";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <ToastPreview />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
