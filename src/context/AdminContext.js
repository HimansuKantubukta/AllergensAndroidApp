import React from 'react';

const noop = () => {};

const AdminContext = React.createContext({
  selectedOutlets: [], // Array of Objects with `id` and `name`
  selectedMenuPlans: [],
  logMessages: [],
  pushToken: '', // Device identifier token for push notifications
  outletNameOverrides: {}, // map id -> name: allows users to specify a customised name for an outlet.
  outletSettings: {}, // map <outlet id> -> additional settings per outlet.
  authCode: null,
  slowTradingOutletsRequest: false,
  // The setters below are changed later by the App
  setSelectedOutlets: noop,
  setSelectedMenuPlans: noop,
  insertLogMessage: noop,
  setPushToken: noop,
  setOutletNameOverrides: noop,
  setOutletSettings: noop,
  setAuthCode: noop,
  setSlowTradingOutletsRequest: noop
});

export default AdminContext;
