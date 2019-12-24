// base
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// components
import NotFound from './views/NotFound';

// assets
import './App.scss';

// views
import routes from './views';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {
            routes.map(({path, component}) => (
              <Route exact key={path} path={path} component={component} />
            ))
          }
          <Route from="*" component={ NotFound } />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
