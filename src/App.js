import { React, BrowserRouter, Switch, Route } from './libraries';
import { Laporan, Homepage, NotFound404, PrivacyPolicy } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/kebijakan-privasi" exact component={PrivacyPolicy} />
        <Route path="/laporan" exact component={Laporan} />
        <Route path="*" exact component={NotFound404} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
