# Redux Flow in DevTinder

## Overview

This application uses **Redux Toolkit** for state management. Redux follows a unidirectional data flow pattern.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      App.jsx                            │
│                   <Provider store={appStore}>            │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  appStore                          │  │
│  │  ┌─────────────────────────────────┐              │  │
│  │  │  user slice (state: null)       │              │  │
│  │  │  - addUser(payload)             │              │  │
│  │  │  - removeUser()                 │              │  │
│  │  └─────────────────────────────────┘              │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Components:                                            │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐           │
│  │ Login    │   │ NavBar   │   │ Profile  │           │
│  │ dispatch │   │ selector │   │ selector │           │
│  └──────────┘   └──────────┘   └──────────┘           │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
src/utils/
├── appStore.js   → Configures the Redux store
└── userSlice.js  → Defines user state, actions & reducers
```

## Redux Flow (Step by Step)

### 1. Store Configuration (`utils/appStore.js`)

The store is created with `configureStore` and registers the `user` reducer:

```js
const appStore = configureStore({
    reducer: {
        user: userReducer  // state.user
    }
});
```

### 2. Provider Wraps the App (`App.jsx`)

The `<Provider>` makes the store accessible to all components:

```jsx
<Provider store={appStore}>
    <BrowserRouter>
        <Routes>...</Routes>
    </BrowserRouter>
</Provider>
```

### 3. Slice Definition (`utils/userSlice.js`)

The `userSlice` defines:
- **Initial state**: `null` (no user logged in)
- **Reducers (actions)**:
  - `addUser` → sets user data from API response
  - `removeUser` → resets state to `null` (logout)

```js
const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        addUser: (state, action) => action.payload,
        removeUser: () => null
    }
});
```

### 4. Dispatching Actions (`Login.jsx`)

On successful login, the `addUser` action is dispatched with the API response:

```jsx
const dispatch = useDispatch();

// After successful login API call:
dispatch(addUser(response.data));
```

### 5. Reading State (Components)

Any component can read the user state using `useSelector`:

```jsx
const user = useSelector((store) => store.user);
```

## Data Flow Diagram

```
User clicks "Login"
        │
        ▼
Login.jsx calls API ──► POST /login
        │                      │
        │                      ▼
        │               Server responds
        │               with user data
        │                      │
        ▼                      ▼
dispatch(addUser(data)) ◄──── response.data
        │
        ▼
Redux Store updates state.user = data
        │
        ▼
All subscribed components (useSelector) re-render
        │
        ▼
NavBar / Profile / etc. show updated user info
```

## Key Concepts

| Concept | File | Purpose |
|---------|------|---------|
| **Store** | `appStore.js` | Single source of truth for app state |
| **Slice** | `userSlice.js` | Defines a piece of state + its reducers |
| **Action** | `addUser`, `removeUser` | Describes what happened |
| **Reducer** | Inside `createSlice` | Pure function that updates state |
| **Dispatch** | `Login.jsx` | Sends an action to the store |
| **Selector** | Components | Reads data from the store |

## When to Use Each Action

- **`addUser`** → After login success, after fetching profile
- **`removeUser`** → On logout, on auth token expiry
