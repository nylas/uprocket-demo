import React, {
  Fragment,
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  FC,
} from "react";

import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import {
  XMarkIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";

// Define a type for toast variations
type ToastType = "success" | "error" | "info" | "warn";

// Define a type for toast notifications
type Toast = {
  id: number;
  title: string;
  content: string;
  type: ToastType;
  duration?: number;
};

// Define the context shape
interface ToastContextType {
  addToast: (
    title: string,
    content: string,
    type: ToastType,
    duration?: number
  ) => void;
  removeToast: (id: number) => void;
}

// Toast context creation with default values
const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
  removeToast: () => {},
});

// ToastProvider Props type
interface ToastProviderProps {
  children: ReactNode;
}

// Toast provider component
export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (
      title: string,
      content: string,
      type: ToastType,
      duration: number = 5000
    ) => {
      const id = Math.random();
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, title, content, type, duration },
      ]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// ToastContainer Props type
interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

// Function to get styles based on toast type
const getToastStyles = (type: ToastType) => {
  switch (type) {
    case "success":
      return "bg-green-200 text-green-700";
    case "error":
      return "bg-red-200 text-red-700";
    case "info":
      return "bg-blue-200 text-blue-700";
    case "warn":
      return "bg-yellow-200 text-yellow-700";
    default:
      return "";
  }
};

// Toast container component
const ToastContainer: FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <Transition
            key={toast.id}
            show={true}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {toast.type === "success" && (
                      <CheckCircleIcon
                        className="h-6 w-6 text-green-400"
                        aria-hidden="true"
                      />
                    )}
                    {toast.type === "error" && (
                      <XMarkIcon
                        className="h-6 w-6 text-red-400"
                        aria-hidden="true"
                      />
                    )}
                    {toast.type === "info" && (
                      <InformationCircleIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                      />
                    )}
                    {toast.type === "warn" && (
                      <ExclamationCircleIcon
                        className="h-6 w-6 text-yellow-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {toast.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {toast.content}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => removeToast(toast.id)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        ))}
      </div>
    </div>
  );
};
