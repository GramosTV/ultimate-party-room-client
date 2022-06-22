import React from 'react';
import ReactDOM from 'react-dom/client';
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './style/video.css';
import './style/canvas.css';
import './style/userList.css';
import './style/roomList.css';
import './style/nameForm.css';
import './style/pfpForm.css';
import './style/chat.css';
import './style/app.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // Had to disable strict mode due to this bug: https://github.com/cookpete/react-player/issues/1453
  <React.Fragment>
    <App />
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
