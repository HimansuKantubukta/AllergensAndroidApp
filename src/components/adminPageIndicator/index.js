import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

const pages = [
  { id: 'Outlets', name: 'Select Outlets' },
  { id: 'MenuPlans', name: 'Select Menu Plans' },
  { id: 'AdminSummary', name: 'Confirm', final: true }
];

export default function AdminPageIndicator({ active }) {
  const currentPage = page => {
    return page.id === active ? (
      <Text style={[styles.page, styles.bordered, styles.pageCurrent]}>
        {page.name}
      </Text>
    ) : (
      <Text style={styles.page}>{page.name}</Text>
    );
  };
  return (
    <View style={styles.headerStyle}>
      {pages.map(page => (
        <View key={page.id} style={styles.pageWrapper}>
          {currentPage(page)}
          {!page.final && <View style={styles.line} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25
  },
  pageWrapper: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  page: {
    fontSize: 16,
    width: 180,
    height: 40,
    backgroundColor: 'white',
    fontFamily: 'nunito-regular',
    textAlign: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderRadius: 2
  },
  pageCurrent: {
    fontFamily: 'nunito-bold',
    borderColor: '#777777',
    borderWidth: 1
  },
  line: {
    width: 35,
    backgroundColor: 'rgba(151,151,151,0.5)',
    height: 1
  }
});
