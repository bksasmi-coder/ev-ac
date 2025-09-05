const CACHE_NAME = 'simple-account-manager-v1';

// A comprehensive list of all files that make up the app shell.
const urlsToCache = [
  '/',
  '/index.html',
  '/icon.svg',
  '/manifest.json',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/hooks/useLocalStorage.ts',
  '/hooks/useDarkMode.ts',
  '/hooks/useAuth.ts',
  '/hooks/useSimulatedCloudStorage.ts',
  '/hooks/useTransactionCalculations.ts',
  '/components/icons/CashIcon.tsx',
  '/components/icons/LoanIcon.tsx',
  '/components/icons/SunIcon.tsx',
  '/components/icons/MoonIcon.tsx',
  '/components/Card.tsx',
  '/components/AccountSummary.tsx',
  '/components/ProfitLossStatement.tsx',
  '/components/TransactionForm.tsx',
  '/components/TransactionList.tsx',
  '/components/EditTransactionModal.tsx',
  '/components/MonthlyReport.tsx',
  '/components/icons/HomeIcon.tsx',
  '/components/icons/BackIcon.tsx',
  '/components/icons/AddIcon.tsx',
  '/components/icons/ReportIcon.tsx',
  '/components/BottomNavBar.tsx',
  '/components/InstallPWA.tsx',
  '/components/icons/InstallIcon.tsx',
  '/components/icons/TrashIcon.tsx',
  '/components/DeleteConfirmationModal.tsx',
  '/components/LoginPage.tsx',
  '/components/icons/LogoutIcon.tsx',
  '/components/icons/ServiceIcon.tsx',
  '/components/ServiceAndRepair.tsx',
  '/components/ToggleSwitch.tsx',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/nepali-date-converter@3.3.1/dist/nepali-date-converter.umd.js',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/'
];

// Install event: opens a cache and adds the app shell files to it.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        // Use {ignoreSearch: true} if there are query parameters that should be ignored.
        // It's often a good practice.
        return Promise.all(
          urlsToCache.map(url => cache.add(new Request(url, {cache: 'reload'})))
        );
      })
  );
});

// Fetch event: serves requests from the cache first, falling back to the network.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the cached response
        if (response) {
          return response;
        }
        // Not in cache - fetch from the network
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event: cleans up old caches to save space.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});