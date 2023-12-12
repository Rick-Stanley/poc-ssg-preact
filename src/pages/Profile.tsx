import { ErrorBoundary, LocationProvider, Router, Route } from 'preact-iso';

function ProfileA() {
  return <h2>A</h2>;
}

function ProfileB() {
  return <h2>B</h2>;
}

function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <ErrorBoundary>
        <Router>
          <Route path="/a" component={ProfileA} />
          <Route path="/b" component={ProfileB} />
        </Router>
      </ErrorBoundary>
    </div>
  );
}

const App = () => (
  <LocationProvider>
    <ErrorBoundary>
      <Router>
        {/* Error here                 ↓  */}
        <Route path="/profiles/*" component={Profile} />
      </Router>
    </ErrorBoundary>
  </LocationProvider>
);
