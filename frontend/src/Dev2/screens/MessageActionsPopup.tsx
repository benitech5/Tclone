import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const actions = [
  { label: 'Reply', icon: '↩️' },
  { label: 'Copy', icon: '📋' },
  { label: 'Copy Link', icon: '🔗' },
  { label: 'Save to Gallery', icon: '💾' },
  { label: 'Forward', icon: '➡️' },
  { label: 'Pin', icon: '📌' },
  { label: 'Edit', icon: '✏️' },
  { label: 'Report', icon: '⚠️' },
  { label: 'Delete', icon: '🗑️' },
];

const emojis = ['😍', '👍', '🖤', '❤️', '🔥', '🐋', '🎉'];

const MessageActionsPopup = ({ visible, onClose, onAction }) => {
  if (!visible) return null;
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.emojiRow}>
            {emojis.map(e => (
              <TouchableOpacity key={e} style={styles.emojiBtn} onPress={() => onAction(e)}>
                <Text style={styles.emoji}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {actions.map(a => (
            <TouchableOpacity key={a.label} style={styles.actionRow} onPress={() => onAction(a.label)}>
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  popup: { backgroundColor: '#fff', borderRadius: 16, padding: 16, width: 280 },
  emojiRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  emojiBtn: { marginHorizontal: 4 },
  emoji: { fontSize: 24 },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  actionIcon: { fontSize: 18, width: 32 },
  actionLabel: { fontSize: 16 },
  closeBtn: { marginTop: 12, alignItems: 'center' },
  closeText: { color: '#e53935', fontWeight: 'bold' },
});

export default MessageActionsPopup; 