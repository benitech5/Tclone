import { useSettings } from '../SettingsContext';

export const useChatSettings = () => {
  const { chatSettings } = useSettings();
  
  return {
    messageSize: chatSettings.messageSize,
    messageCorner: chatSettings.messageCorner,
    getMessageStyle: (isReply = false) => ({
      fontSize: chatSettings.messageSize,
      borderRadius: isReply ? chatSettings.messageCorner : undefined,
    }),
    getReplyStyle: () => ({
      fontSize: chatSettings.messageSize,
      borderRadius: chatSettings.messageCorner,
      backgroundColor: '#b388ff',
      paddingHorizontal: 12,
      paddingVertical: 6,
      alignSelf: 'flex-end' as const,
      marginTop: 4,
    }),
  };
}; 