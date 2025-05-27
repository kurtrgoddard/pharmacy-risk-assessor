
import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const OfflineNotification: React.FC = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <Alert className="fixed top-4 left-4 right-4 z-50 bg-yellow-50 border-yellow-200 text-yellow-800 md:max-w-md md:left-auto md:right-4">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="text-sm">
        You're currently offline. Some features may not work properly.
      </AlertDescription>
    </Alert>
  );
};

export default OfflineNotification;
