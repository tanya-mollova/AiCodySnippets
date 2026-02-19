# GitHub Copilot Instructions — AiCodySnippets

> This file guides AI coding agents (Copilot, Cursor, Claude, etc.) working on this codebase.
> Keep it up to date when architecture or conventions change.

---

## Stack Overview

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Database    | MongoDB (local `mongodb://localhost:27017/aicodysnippets`) via Mongoose |
| Backend     | Node.js + Express — **ESM modules** (`"type":"module"`) |
| Frontend    | React 19 + Vite, MUI v7, Redux Toolkit, React Router v7 |
| Auth        | JWT stored in `localStorage`, Axios interceptors for auto-attach + auto-logout |
| Highlighting | Prism.js (`prism-tomorrow` theme)               |
| Dev runner  | `concurrently` — single `npm run dev` from root  |

---

## Running the App

```bash
# From the repo root — starts both servers concurrently
npm run dev

# Individual servers
cd backend && npm run dev   # http://localhost:5000
cd frontend && npm run dev  # http://localhost:5173
```

**Port conflicts on Windows:**
```powershell
# Find and kill processes on a port
netstat -ano | findstr :5000
taskkill /F /PID <PID>
```

---

## Project Structure

```
/
├── backend/
│   ├── server.js               # Express entry point
│   ├── config/db.js            # Mongoose connection
│   ├── models/
│   │   ├── Snippet.js          # Snippet schema + indexes
│   │   └── User.js             # User schema + bcrypt pre-save
│   ├── controllers/
│   │   ├── snippetController.js
│   │   └── authController.js
│   ├── routes/
│   │   ├── snippetRoutes.js
│   │   └── authRoutes.js
│   └── middleware/
│       ├── auth.js             # JWT protect middleware
│       └── errorHandler.js
└── frontend/src/
    ├── App.jsx                 # Routes definition
    ├── components/
    │   ├── CodeBlock.jsx       # Prism syntax highlight component
    │   ├── Navbar.jsx          # Nav links + active state
    │   ├── FiltersBar.jsx      # Language/search/sort filters
    │   ├── CursorGlow.jsx
    │   └── PrivateRoute.jsx
    ├── pages/
    │   ├── Welcome.jsx         # Public landing + public snippet cards
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── MySnippets.jsx      # /my-snippets — CRUD (auth required)
    │   ├── PublicSnippets.jsx  # /explore — read-only browse
    │   └── Dashboard.jsx       # Legacy — redirects to /my-snippets
    ├── services/
    │   ├── api.js              # Axios instance with interceptors
    │   ├── snippetService.js   # Snippet API calls
    │   └── authService.js      # Auth API calls
    └── store/
        ├── store.js
        └── slices/
            ├── authSlice.js
            └── snippetsSlice.js
```

---

## Backend Rules

### ESM — Always use `.js` extensions in imports
```js
// ✅ Correct
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

// ❌ Wrong — will throw ERR_MODULE_NOT_FOUND
import User from '../models/User';
```

### API Routes

| Method | Endpoint              | Auth     | Description                        |
|--------|-----------------------|----------|------------------------------------|
| GET    | `/api/snippets`       | Optional | Own snippets if authed, public only if not |
| GET    | `/api/snippets/my`    | Required | Current user's snippets only        |
| GET    | `/api/snippets/public`| None     | All public snippets                 |
| GET    | `/api/snippets/:id`   | None     | Single snippet                      |
| POST   | `/api/snippets`       | Required | Create snippet                      |
| PUT    | `/api/snippets/:id`   | Required | Update own snippet                  |
| DELETE | `/api/snippets/:id`   | Required | Delete own snippet                  |
| POST   | `/api/auth/register`  | None     | Register user                       |
| POST   | `/api/auth/login`     | None     | Login — returns JWT + user          |
| GET    | `/api/auth/me`        | Required | Get current user                    |
| GET    | `/api/health`         | None     | Health check                        |

### Auth Middleware (`protect`)
- Reads `Authorization: Bearer <token>` header
- Attaches `req.user` (password excluded via `.select('-password')`)
- Returns `401` on missing/invalid/expired token

### Password Field — `select: false`
The `User` model sets `password: { select: false }`. **Always** use `.select('+password')` when you need to verify passwords:
```js
const user = await User.findOne({ email }).select('+password');
```
Forgetting this returns `undefined` for password, breaking auth silently.

### JWT — rememberMe Logic
```js
const expiresIn = rememberMe ? '30d' : '1d';
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });
```

### Snippet Text Search Index — Critical
The `Snippet` model text index uses a special override:
```js
snippetSchema.index(
  { title: 'text', description: 'text' },
  { language_override: '__ignored_text_language' }
);
```
**Do not remove `language_override`.** Without it, MongoDB interprets the `language` field on the document as a locale specifier, which breaks text search for most snippet languages (e.g., `python`, `javascript`).

### `.env` (backend)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aicodysnippets
NODE_ENV=development
JWT_SECRET=supersecretjwtkey_aicodysnippets_2026
```
Never duplicate keys in `.env` — Node reads only the first occurrence.

---

## Frontend Rules

### MUI v7 Grid — `size` Prop (BREAKING CHANGE)
MUI v7 removed `xs`, `sm`, `md`, `lg` props from `Grid`. Use the unified `size` prop:
```jsx
// ✅ MUI v7 correct
<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>

// ❌ MUI v5 — silently ignored in v7, cards won't layout correctly
<Grid item xs={12} sm={6} md={4} lg={3}>
```

### Equal-Height Card Grid Pattern
To make cards fill the row with equal height:
```jsx
<Grid container spacing={3}>
  <Grid
    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
    sx={{ display: 'flex' }}         // ← required on Grid item
  >
    <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <CardContent sx={{ flex: 1 }}> {/* ← grows to fill */}
        ...
      </CardContent>
      <CardActions> ... </CardActions>
    </Card>
  </Grid>
</Grid>
```

### Routing (React Router v7)

| Path            | Component        | Auth     |
|-----------------|------------------|----------|
| `/`             | Welcome          | Public   |
| `/login`        | Login            | Public   |
| `/register`     | Register         | Public   |
| `/my-snippets`  | MySnippets       | Private  |
| `/explore`      | PublicSnippets   | Public   |
| `/dashboard`    | → `/my-snippets` | Redirect |

`PrivateRoute` wraps protected pages. After login/register, redirect to `/my-snippets` (not `/dashboard`).

### Redux Slices

**`authSlice`** state shape:
```js
{ user, token, isError, isSuccess, isLoading, message }
```
- `reset()` action clears `isError/isSuccess/isLoading/message`
- **Only call `dispatch(reset())` in the `return` (cleanup) of a `useEffect`**, never in the dependency array alongside `isError`. Putting `isError` in deps and calling `reset()` in the effect body clears the error before the Alert can render.

```jsx
// ✅ Correct pattern
useEffect(() => {
  if (isError) setLocalError(message); // capture to local state first
  if (isSuccess) navigate('/my-snippets');
  return () => { dispatch(reset()); };  // cleanup only
}, [isError, isSuccess, message, navigate, dispatch]);
```

**`snippetsSlice`** state shape:
```js
{
  items: [],          // legacy, avoid using
  myItems: [],        // user's own snippets
  publicItems: [],    // public snippets
  loadingMy: false,
  loadingPublic: false,
  errorMy: null,
  errorPublic: null,
  currentSnippet: null,
}
```

Thunks: `fetchMySnippets`, `fetchPublicSnippets`, `createSnippet`, `updateSnippet(id, snippetData)`, `deleteSnippet(id)`

### Axios API Client (`services/api.js`)
- Base URL: `VITE_API_URL` env var or `/api` (proxied by Vite to `localhost:5000`)
- Request interceptor: auto-attaches `Authorization: Bearer <token>` from `localStorage`
- Response interceptor: on `401`, clears localStorage and redirects to `/login`

### Prism.js Syntax Highlighting
**Always** use `Prism.highlight()` + `dangerouslySetInnerHTML`. Never use `highlightAllUnder` or `highlightElement` via `useRef` — it races with React's reconciler and silently fails.

```jsx
// ✅ Correct — via CodeBlock component
import CodeBlock from '../components/CodeBlock';
<CodeBlock code={snippet.code} language={snippet.language} maxHeight={200} overflow="hidden" />

// ✅ Direct usage pattern (inside CodeBlock.jsx)
const grammar = Prism.languages[lang] || Prism.languages.plaintext;
const highlighted = Prism.highlight(code, grammar, lang);
<code dangerouslySetInnerHTML={{ __html: highlighted }} />

// ❌ Wrong — causes silent no-op in React
useEffect(() => { Prism.highlightAllUnder(ref.current); }, [code]);
```

`CodeBlock` props:
| Prop        | Default   | Notes                                    |
|-------------|-----------|------------------------------------------|
| `code`      | required  | Raw code string                          |
| `language`  | required  | Prism language key (e.g. `'javascript'`) |
| `maxHeight` | `200`     | px — for card previews                   |
| `overflow`  | `'auto'`  | Set to `'hidden'` for cards              |

### Color / Design Tokens

```js
// Language chip
sx={{ bgcolor: '#FFB300', color: '#1a1a1a' }}

// Tag chips
sx={{
  bgcolor: 'rgba(255,179,0,0.12)',
  color: '#FFB300',
  border: '1px solid rgba(255,179,0,0.35)',
}}
```

Primary accent is amber/yellow `#FFB300`. Background is dark (near-black). Do not introduce new accent colors without updating all chip/tag usages.

### Delete Confirmation — Always Use MUI Dialog
Never use `window.confirm()` for destructive actions. Use a MUI `Dialog` with:
- Red `DeleteForever` icon + warning text + snippet title
- `Cancel` (outlined) and `Delete` (red `contained`) buttons
- State: `{ open: bool, snippetId: string, snippetTitle: string }`

### Form / Auth UX Patterns
- Show password toggle (`Visibility`/`VisibilityOff` icons) on all password fields
- Use `InputAdornment` for leading icons (Email, Lock)
- Show `CircularProgress` inside submit button while `isLoading`
- Display server errors via MUI `Alert severity="error"` with shake animation
- Clear Redux error on every keystroke: `onChange={() => { if (isError) dispatch(reset()); }}`
- Register page: live password requirements checklist (uppercase, lowercase, number, 8+ chars)

---

## Naming & File Conventions

- **Pages**: PascalCase JSX in `frontend/src/pages/`. Export from `pages/index.js`.
- **Components**: PascalCase JSX in `frontend/src/components/`. Export from `components/index.js`.
- **Services**: camelCase in `frontend/src/services/`. One file per domain (`snippetService.js`, `authService.js`, `api.js`).
- **Slices**: camelCase in `frontend/src/store/slices/`. One slice per domain.
- **Backend controllers**: camelCase exports, one controller per model. Named exports only.
- **Backend routes**: one route file per domain. Import controller functions + middleware explicitly.
- **Backend models**: PascalCase filenames matching model name (`Snippet.js`, `User.js`).

---

## Common Gotchas

| Problem | Root Cause | Fix |
|---------|-----------|-----|
| Cards not in 4-column layout | Using MUI v5 `xs/sm/md/lg` props | Use `size={{ xs:12, sm:6, md:4, lg:3 }}` |
| Prism highlighting not applied | `highlightAllUnder` in useEffect | Use `Prism.highlight()` + `dangerouslySetInnerHTML` |
| Auth error Alert disappears instantly | `isError` in useEffect deps triggers `reset()` too early | Capture error to local state; call `reset()` only in cleanup |
| Login always fails silently | Password is `undefined` from Mongoose | Add `.select('+password')` to user query |
| Text search breaks for snippets | MongoDB treats `language` field as locale | Keep `language_override: '__ignored_text_language'` on text index |
| Backend import not found | Missing `.js` extension in ESM import | Always add `.js` to relative imports in backend |
| `.env` key silently ignored | Duplicate key — Node reads first occurrence only | Remove duplicate keys from `.env` |
| Port already in use | Previous process still running | `taskkill /F /PID <pid>` on Windows |
