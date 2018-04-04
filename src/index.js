import * as React from 'react';
import mirror, { render } from 'mirrorx';
import registerServiceWorker from './registerServiceWorker';
import models from './models';
import App from './router';
import './index.css';

// inject model
models.forEach((model) => {
  mirror.model(model);
})

//render 
render(
  <App />,
  document.getElementById('root')
);

registerServiceWorker();
