import { useToast } from "../Context/ToastContext";
import { Button, SafeAreaView } from "react-native";

const ToastPreview = () => {
  const { showToast } = useToast();
  return (
    <SafeAreaView>
      <Button
        title="Show Success Toast"
        onPress={() =>
          showToast({
            message: "This is an example!!!",
            preset: "success",
          })
        }
      />
      <Button
        title="Show Error Toast"
        onPress={() =>
          showToast({
            message: "This is an example!!!",
            preset: "error",
          })
        }
      />
    </SafeAreaView>
  );
};

export default ToastPreview;
