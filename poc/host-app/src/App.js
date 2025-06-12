import React, { Suspense } from "react";

const RemoteSyncedCounter = React.lazy(() => import("remoteCounter/SyncedCounter"));
const RemoteUnsyncedCounter = React.lazy(() => import("remoteCounter/UnsyncedCounter"));

const App = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Host Application</h1>
      
      <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
        <h2>Local Component</h2>
        <p>This is from the host app</p>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
        <h2>Remote Synced Counter</h2>
        <Suspense fallback={<div>Loading Remote Synced Counter...</div>}>
          <RemoteSyncedCounter />
        </Suspense>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
        <h2>Remote Unsynced Counter</h2>
        <Suspense fallback={<div>Loading Remote Unsynced Counter...</div>}>
          <RemoteUnsyncedCounter />
        </Suspense>
      </div>
    </div>
  );
};

export default App;