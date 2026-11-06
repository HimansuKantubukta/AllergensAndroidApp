import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { AWSHostedUILogoutURL } from '../../config/urls';

export default class Authentication {
  static async logout() {
    // Create a deep linking URI for redirection after logout
    const expoRedirectUri = Linking.createURL('/loggedout', { scheme: 'allergens' });

    // Construct the full AWS logout URL with the redirect URI
    const url = AWSHostedUILogoutURL(expoRedirectUri);

    try {
      // Open the external browser with the URL and handle the redirection
      const result = await WebBrowser.openAuthSessionAsync(url, expoRedirectUri);

      // Check if the user successfully completed the logout process
      if (result.type === 'success' || result.type === 'dismiss') {
        return true; // Logout successful or dismissed by the user
      } else {
        return false; // Handle failure or cancellation here
      }
    } catch (error) {
      // Handle potential errors (e.g., network issues, URL opening issues)
      console.error('Error during logout:', error);
      return false;
    }
  }
}
