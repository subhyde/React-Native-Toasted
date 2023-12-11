import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from "react";
import { Toast } from "../Components/Toast";
// import { Toast } from "../Components/Toast/Toast";

interface ToastContextProps {
  showToast: (toastProps: showToastProps) => void;
}
interface showToastProps {
  message: string | null;
  preset: "success" | "error" | null;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const [toastParams, setToastParams] = useState<showToastProps>({
    message: null,
    preset: null,
  });

  const showToast = (toastProps: showToastProps) => {
    setToastParams({
      message: toastProps.message,
      preset: toastProps.preset,
    });
  };

  const resetToast = () => {
    setToastParams({
      message: null,
      preset: null,
    });
  };

  const value: ToastContextProps = {
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toastParams.message && toastParams.preset && (
        <Toast
          message={toastParams.message}
          preset={toastParams.preset}
          resetToast={resetToast}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
