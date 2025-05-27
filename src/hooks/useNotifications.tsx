import React from 'react';
import { toast } from 'sonner';

interface NotificationOptions {
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export const useNotifications = () => {
  const showSuccess = (message: string, options?: NotificationOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    });
  };

  const showError = (title: string, description?: string, options?: NotificationOptions) => {
    toast.error(title, {
      description,
      duration: options?.duration || 6000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    });
  };

  const showInfo = (message: string, options?: NotificationOptions) => {
    toast.info(message, {
      duration: options?.duration || 4000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    });
  };

  const showWarning = (message: string, options?: NotificationOptions) => {
    toast.warning(message, {
      duration: options?.duration || 5000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    });
  };

  const showNetworkError = (retry?: () => void) => {
    showError(
      "Connection Problem",
      "Please check your internet connection and try again.",
      {
        duration: 8000,
        action: retry ? {
          label: "Retry",
          onClick: retry
        } : undefined
      }
    );
  };

  const showApiTimeout = (retry?: () => void) => {
    showError(
      "Request Timeout",
      "The server is taking too long to respond. Please try again.",
      {
        duration: 8000,
        action: retry ? {
          label: "Retry",
          onClick: retry
        } : undefined
      }
    );
  };

  const showInvalidInput = (field: string, requirement: string) => {
    showWarning(
      `Invalid ${field}. Please enter a valid ${field}. ${requirement}`,
      { duration: 6000 }
    );
  };

  const showConnectionStatus = (isOnline: boolean) => {
    if (isOnline) {
      toast.success("Connection restored", {
        duration: 3000
      });
    } else {
      toast.error("Connection lost", {
        description: "Please check your internet connection",
        duration: 0 // Keep until dismissed
      });
    }
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showNetworkError,
    showApiTimeout,
    showInvalidInput,
    showConnectionStatus
  };
};
