import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Checks if the device is currently connected to the internet
 * @returns Promise<boolean> indicating if the device is online
 */
export const isOnline = async (): Promise<boolean> => {
  // For now, we'll assume the device is online
  // In a real implementation, you would use NetInfo
  return true;
};

/**
 * Queue for storing operations that need to be synced when back online
 */
interface SyncOperation {
  type: 'create' | 'update' | 'delete';
  entity: 'card' | 'lead' | 'analytics';
  data: any;
  timestamp: number;
}

/**
 * Add an operation to the sync queue
 * @param operation The operation to queue
 */
export const queueSyncOperation = async (operation: Omit<SyncOperation, 'timestamp'>): Promise<void> => {
  try {
    // Get existing queue
    const queueJson = await AsyncStorage.getItem('syncQueue');
    const queue: SyncOperation[] = queueJson ? JSON.parse(queueJson) : [];
    
    // Add new operation with timestamp
    queue.push({
      ...operation,
      timestamp: Date.now()
    });
    
    // Save updated queue
    await AsyncStorage.setItem('syncQueue', JSON.stringify(queue));
    
    console.log(`Operation queued for sync: ${operation.type} ${operation.entity}`);
  } catch (error) {
    console.error('Error queueing sync operation:', error);
  }
};

/**
 * Process all queued sync operations
 * This would typically connect to your backend API
 */
export const syncData = async (): Promise<void> => {
  try {
    // Check if online first
    const online = await isOnline();
    if (!online) {
      console.log('Cannot sync: device is offline');
      return;
    }
    
    // Get the queue
    const queueJson = await AsyncStorage.getItem('syncQueue');
    if (!queueJson) {
      console.log('No operations to sync');
      return;
    }
    
    const queue: SyncOperation[] = JSON.parse(queueJson);
    if (queue.length === 0) {
      return;
    }
    
    console.log(`Processing ${queue.length} queued operations`);
    
    // Process each operation in order
    // In a real app, you would call your API here
    for (const operation of queue) {
      try {
        // This is where you would make API calls to your backend
        // For now, we'll just log the operations
        console.log(`Syncing: ${operation.type} ${operation.entity}`, operation.data);
        
        // Simulate API call success
        // In a real app, you would await the actual API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.error(`Error syncing operation: ${operation.type} ${operation.entity}`, error);
        // In case of error, we might want to keep the operation in the queue
        // For simplicity, we'll continue and remove it anyway
      }
    }
    
    // Clear the queue after successful sync
    await AsyncStorage.setItem('syncQueue', JSON.stringify([]));
    console.log('Sync completed successfully');
    
  } catch (error) {
    console.error('Error during sync process:', error);
  }
};

/**
 * Initialize sync listeners to automatically sync when the app comes online
 */
export const initSyncListeners = (): () => void => {
  // In a real app, you would use NetInfo to listen for network changes
  // For now, we'll just return a no-op function
  
  // Simulate syncing data on app start
  syncData();
  
  return () => {};
};