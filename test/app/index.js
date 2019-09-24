import React, { useState } from 'react';
import { render } from 'react-dom';
import useSync from '../../src/lib';

function App() {
  const [clicked, setClicked] = useSync(useState(0), 'clicked');

  return (
    <React.Fragment>
      <p>Clicked {clicked} times!</p>
      <button onClick={() => setClicked(clicked + 1)}>Click</button>
    </React.Fragment>
  );
}

render(<App />, document.getElementById('app'));
