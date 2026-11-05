import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Dialog from 'react-native-dialog';

export default function AuthTokenPopup({ visible, handleCancel, handleOK }) {
  const [token, setToken] = useState('eyJraWQiOiJmMWZPTEswWlMwSk1RenB3SlIrQ1wvR1Q0UDBBQmYyS3NrUlc2cXFRRGtITT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiZTlOaTJ1UzdJQVdWeXJSVDljajRZdyIsInN1YiI6ImFjZGI1ODhiLWViY2QtNDcwYS1iNGVlLTVmODJiMTJiOTIyNSIsImNvZ25pdG86Z3JvdXBzIjpbImV1LXdlc3QtMV9adHlmT1l1QTVfQTEtQUxMRVJHRU4tVUFUIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTEuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0xX1p0eWZPWXVBNSIsImNvZ25pdG86dXNlcm5hbWUiOiJBMS1BTExFUkdFTi1VQVRfYmF6ZGF2aTEiLCJub25jZSI6IlFTUlcwY0hsNnVYOFRBRlgzX2lLVDBkMFN3ZzNVQ1NBYnVIcFRTYjdDZlJRVE1xc0JmNW94aFpqUktpU2JUYU5jQ2ZYMTgyQ1E3SVd6NkhtRS1ZMHdpNGNLZGZHcS1GSEZhYzdrNURWR3FGMUVscnA0VlVGM0tKZk9NMDd5a2hHaFN1MktpM1JTUDFvMXZ1a1FxVlEzdlJSV1ZISmVzTWZKX0h4b1RSQ2xiQSIsImF1ZCI6IjE4bjhlMDJhcG83ZjQzN3NwaDlha3ZpaW5yIiwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoiYmF6ZGF2aTEiLCJwcm92aWRlck5hbWUiOiJBMS1BTExFUkdFTi1VQVQiLCJwcm92aWRlclR5cGUiOiJPSURDIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTY0Mjc3MTI3MDM3MSJ9XSwidG9rZW5fdXNlIjoiaWQiLCJjdXN0b206RW1wbG95ZWVJZCI6IjExNTIyODk5IiwiYXV0aF90aW1lIjoxNjc2NTAxMzIwLCJleHAiOjE2NzY1MDQ5MjAsImlhdCI6MTY3NjUwMTMyMCwianRpIjoiN2YxNjE3ZTUtY2I5NS00MjliLTgyNDEtNDcyMWNjNTYyZGZjIiwiZW1haWwiOiJJVC5URVNUSU5HMjRAQ09NUEFTUy1HUk9VUC5DTy5VSyJ9.huVuEC-0fYEdbN0HidTkJBOyZnsWKjd4KICIvsIB8j-xu7fOKa1w5so2IEOf26QaX1Wr7Qaog5VCQScWSSq2yYnkGofP2huTYZlx-QfdUB3K3HbyHznWfpdRH2VodW-RWEknY56OxDda5CNfmbH5NmVRQfTJ14uUWVpEuDc42ZpEAfjqXnF-OAVvLWK1bgDZtpbDDUiBWtpw-m0pGhmLy5zyIOLZTWjLd1hD4oeV2bW01QE_kHtk5ja_youn6TYBLlk-LUdEIPLAQmRyriMg-HPpVDzlrvC3kMsyaMAwgykekdb2uTnHNs4VBFpBskz58KUrwWhlT9H37g942NGyiQ');

  function onChange(ev) {
    setToken(ev.value);
  }

  function internalHandleOK() {
    handleOK(token);
  }

  return visible ? (
    <View style={styles.container}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Manual auth JWT token</Dialog.Title>
        <Dialog.Description>
          For development set the authentication token below.
        </Dialog.Description>
        <Dialog.Input value={token} onChange={onChange} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="OK" onPress={internalHandleOK} />
      </Dialog.Container>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {}
});
