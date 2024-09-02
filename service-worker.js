// service-worker.js

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "no data available" };
  const dataobj = {
      body: data.body,
      icon: data.icon,
      tag: data.tag,
  };
  console.log(data);
  event.waitUntil(
      self.registration.showNotification(data.title, dataobj)
    
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log('Notification click event received');
  event.notification.close();
   event.waitUntil(
    clients.openWindow("https://www.w3schools.com/").then((windowClient) => {
      console.log('Opened window:', windowClient);
    }).catch((error) => {
      console.error('Failed to open window:', error);
    })
  );

  console.log('Notification clicked');
});



const CACHE_NAME = "Store-data";
const PRE_CACHED_RESOURCES = ["/", "index.html", "script.js"];
self.addEventListener("install", event => {
  async function preCacheResources() {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(PRE_CACHED_RESOURCES);
  }

  event.waitUntil(preCacheResources());
});
  
  self.addEventListener('fetch', event => {
    async function returnCachedResource() {
      try {
        if (event.request.method === 'GET') {
            console.log("this is get request");
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(event.request);
           if (cachedResponse) {
            console.log('Response from cache:', event.request.url);
            return cachedResponse;
          } else {
            const fetchResponse = await fetch(event.request);
            if (fetchResponse) {
              console.log('Caching new response for:', event.request.url);
              cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          }
        } else {
            console.log("this is post request");
          return fetch(event.request);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        return fetch(event.request);
      }
    }
  
    event.respondWith(returnCachedResource());
  });
  
  // self.addEventListener('message', event => {
  //   console.log('Received message from client:', event.data);
  //   // Handle messages from client-side script
  // });
 
  self.addEventListener("activate", event => {
    async function deleteOldCaches() {
      const names = await caches.keys();
      await Promise.all(names.map(name => {
        if (name !== CACHE_NAME) {
          return caches.delete(name);
        }
      }));
    }
  event.waitUntil(deleteOldCaches());
  });;
