# react-use-sync

![Version](https://img.shields.io/badge/version-0.0.2-blue.svg?cacheSeconds=2592000)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/mvasigh/react-use-sync/graphs/commit-activity)
[![Twitter: mehdi_vasigh](https://img.shields.io/twitter/follow/mehdi_vasigh.svg?style=social)](https://twitter.com/mehdi_vasigh)

> React hook for synchronized values between windows

## Install

Install with npm:

```sh
npm install react-use-sync
```

Or with yarn:

```sh
yarn add react-use-sync
```

## Usage

To sync state between tabs, wrap a React Hook that returns a function with the `useState` signature (i.e. `[value, setValue]`).

```jsx
import React, { useState } from 'react'
import useSync from 'react-use-sync'

function App() {
  const [count, setCount] = useSync('count', useState(0)));
  return (
    <div>
      <p>The count is {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click me!
      </button>
    </div>
  )
}
```

## Run tests

```sh
npm run test
```

Or:

```sh
yarn test
```

## Author

👤 **Mehdi Vasigh <mehdivasigh@gmail.com>**

- Twitter: [@mehdi_vasigh](https://twitter.com/mehdi_vasigh)
- Github: [@mvasigh](https://github.com/mvasigh)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/mvasigh/react-use-sync/issues).

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
