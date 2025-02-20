'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "b20a09b8020cf0d2fdbe4f49dd5d74d2",
"assets/AssetManifest.bin.json": "f313d5e473edcc47b9ee1d7c201e4b77",
"assets/AssetManifest.json": "073456fd0aa27efde3dcd07d3d9638bd",
"assets/FontManifest.json": "3d8104147621ced198d5aa531e9a46e3",
"assets/fonts/MaterialIcons-Regular.otf": "fbaae7267d916506426993fb2c929bf8",
"assets/lib/assets/fonts/CascadiaCode.ttf": "206399278c4111a44fbf13de6ffc12d0",
"assets/lib/assets/fonts/CascadiaCodeItalic.ttf": "3ffc56f2bae8f9370699a2a020aaa25b",
"assets/lib/assets/fonts/CascadiaCodeNF.ttf": "3a962422048545602735755b3e7fa17f",
"assets/lib/assets/fonts/CascadiaCodeNFItalic.ttf": "f052530cdc815b417e616384ae64ace9",
"assets/lib/assets/fonts/CascadiaCodePL.ttf": "d8059a88228e9da9d773d33ee64c13c1",
"assets/lib/assets/fonts/CascadiaCodePLItalic.ttf": "b4118ad8ca176d6cabe923924d80558a",
"assets/lib/assets/fonts/CascadiaMono.ttf": "b7de50b2e335ee645ab3b249d8a0fa65",
"assets/lib/assets/fonts/CascadiaMonoItalic.ttf": "20a3e5c10587755a8cd4d4959ed198e2",
"assets/lib/assets/fonts/CascadiaMonoNF.ttf": "292a1975e984aeb060366c0613d2e9ba",
"assets/lib/assets/fonts/CascadiaMonoNFItalic.ttf": "22636ce54d1bc3b0c19b6c231999e951",
"assets/lib/assets/fonts/CascadiaMonoPL.ttf": "0f7d8fda03085cbae783aaa76eb1e746",
"assets/lib/assets/fonts/CascadiaMonoPLItalic.ttf": "d303d55874bb18c8a19fe216520ec49a",
"assets/lib/svg_icons/node_blinking_alert.svg": "b38b6556ae62808f1ee2a7f610efb94a",
"assets/lib/svg_icons/playground_download_icon.svg": "4e962ef5964339d67b2f089f0460f1bb",
"assets/lib/svg_icons/playground_list_execute_icon.svg": "3c737c9ac8cf501eae793fe9e7283e64",
"assets/lib/svg_icons/playground_save_icon.svg": "052f3105ff994e31d1f99cbfbf8ee964",
"assets/lib/svg_icons/playground_upload_icon.svg": "51f55dd96672f271d058762c63521a65",
"assets/NOTICES": "962b89049d0216e0e22482be0c4c657c",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "26eef3024dbc64886b7f48e1b6fb05cf",
"canvaskit/canvaskit.js.symbols": "efc2cd87d1ff6c586b7d4c7083063a40",
"canvaskit/canvaskit.wasm": "e7602c687313cfac5f495c5eac2fb324",
"canvaskit/chromium/canvaskit.js": "b7ba6d908089f706772b2007c37e6da4",
"canvaskit/chromium/canvaskit.js.symbols": "e115ddcfad5f5b98a90e389433606502",
"canvaskit/chromium/canvaskit.wasm": "ea5ab288728f7200f398f60089048b48",
"canvaskit/skwasm.js": "ac0f73826b925320a1e9b0d3fd7da61c",
"canvaskit/skwasm.js.symbols": "96263e00e3c9bd9cd878ead867c04f3c",
"canvaskit/skwasm.wasm": "828c26a0b1cc8eb1adacbdd0c5e8bcfa",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"flutter_bootstrap.js": "c7c2414884ae995346822eb0b18cd978",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "30d018200f3d69edbbed7a89196857d5",
"/": "30d018200f3d69edbbed7a89196857d5",
"main.dart.js": "0ae5fc19b45918236bca194749751978",
"manifest.json": "605479f48d3c0f6dcf65bd025b93b6ab",
"sqflite_sw.js": "8a8c40eab868921d4c6ec763bb4344d3",
"sqlite3.wasm": "fa7637a49a0e434f2a98f9981856d118",
"version.json": "24d198734ededa6378f215a3122b613c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
