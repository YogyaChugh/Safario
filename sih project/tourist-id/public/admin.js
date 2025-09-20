// DOM elements
        const loginContainer = document.getElementById('loginContainer');
        const adminContainer = document.getElementById('adminContainer');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const consoleOutput = document.getElementById('console-output');
        const consoleInput = document.getElementById('console-input');
        const locationDetails = document.getElementById('locationDetails');
        const userLocationSpan = document.getElementById('userLocation');
        const detectLocationBtn = document.getElementById('detectLocationBtn');
        const createZoneBtn = document.getElementById('createZoneBtn');
        const showAllZonesBtn = document.getElementById('showAllZonesBtn');
        const clearZonesBtn = document.getElementById('clearZonesBtn');
        
        // Initialize the map variable
        let map;
        let drawnItems;
        let drawControl;
        
        // Initialize variables
        let dangerZones = [];
        let userLocationMarker = null;
        let watchId = null;
        let isDrawing = false;

        
        
        // Function to initialize the map
        function initMap() {
            // Initialize the map with a default view
            map = L.map('map', {
                zoomControl: true,
                attributionControl: true
            }).setView([0, 0], 2);
            
            // Add base tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);
            
            // Initialize drawn items
            drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);
            
            // Initialize draw control
            drawControl = new L.Control.Draw({
                draw: {
                    polygon: {
                        allowIntersection: false,
                        drawError: {
                            color: '#ff0000',
                            message: '<strong>Error:</strong> polygon edges cannot cross!'
                        },
                        shapeOptions: {
                            color: '#00cccc',
                            weight: 2,
                            fillOpacity: 0.3
                        }
                    },
                    polyline: false,
                    rectangle: {
                        shapeOptions: {
                            color: '#00cccc',
                            weight: 2,
                            fillOpacity: 0.3
                        }
                    },
                    circle: false,
                    marker: false,
                    circlemarker: false
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: true
                }
            });
            
            map.addControl(drawControl);
            
            // Add event listener for when the map is clicked
            map.on('click', function(e) {
                addLogEntry('info', `Map clicked at: ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);
            });
            
            // Add event listener for when the map view changes
            map.on('moveend', function() {
                const center = map.getCenter();
                addLogEntry('info', `Map centered at: ${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}`);
            });
            
            // Add event listener for when the map is zoomed
            map.on('zoomend', function() {
                addLogEntry('info', `Map zoom level: ${map.getZoom()}`);
            });
            
            // Listen for when drawing starts
            map.on('draw:drawstart', function() {
                isDrawing = true;
            });
            
            // Listen for when drawing stops
            map.on('draw:drawstop', function() {
                isDrawing = false;
            });
            
            // Listen for when a new feature is created
            map.on('draw:created', function(e) {
                const layer = e.layer;
                const type = e.layerType;
                const zoneId = 'zone_' + Date.now();
                const zoneName = prompt("Enter a name for this zone:", "Zone " + (dangerZones.length + 1));
                
                if (zoneName) {
                    // Store the zone
                    dangerZones.push({
                        id: zoneId,
                        name: zoneName,
                        layer: layer,
                        dangerLevel: 1 // Default level
                    });
                    
                    // Add to map
                    drawnItems.addLayer(layer);
                    
                    // Set default style
                    updateZoneStyle(zoneId, 1);
                    
                    // Add popup with zone info
                    layer.bindPopup(`<b>${zoneName}</b><br>Danger Level: 1 (Low)`);
                    
                    addLogEntry('success', `Zone "${zoneName}" created successfully with default danger level 1.`);
                    
                    // Save to localStorage for user website
                    saveZonesToLocalStorage();
                } else {
                    map.removeLayer(layer);
                    addLogEntry('warning', 'Zone creation cancelled.');
                }
            });
            
            // Load any existing zones from localStorage
            loadZonesFromLocalStorage();
        }
        
        // Function to save zones to localStorage
        function saveZonesToLocalStorage() {
            const zonesData = dangerZones.map(zone => {
                let points = [];
                
                if (zone.layer instanceof L.Polygon) {
                    points = zone.layer.getLatLngs()[0].map(latLng => [latLng.lat, latLng.lng]);
                } else if (zone.layer instanceof L.Rectangle) {
                    const bounds = zone.layer.getBounds();
                    points = [
                        [bounds.getNorthWest().lat, bounds.getNorthWest().lng],
                        [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
                        [bounds.getSouthEast().lat, bounds.getSouthEast().lng],
                        [bounds.getSouthWest().lat, bounds.getSouthWest().lng]
                    ];
                }
                
                return {
                    id: zone.id,
                    name: zone.name,
                    points: points,
                    level: zone.dangerLevel,
                    color: getColorForLevel(zone.dangerLevel),
                    description: `Danger Level: ${zone.dangerLevel} (${getDangerLevelName(zone.dangerLevel)})`
                };
            });
            
            localStorage.setItem('adminDangerZones', JSON.stringify(zonesData));
            addLogEntry('info', 'Zones saved to storage.');
        }
        
        // Function to load zones from localStorage
        function loadZonesFromLocalStorage() {
            const zonesData = JSON.parse(localStorage.getItem('adminDangerZones') || '[]');
            
            zonesData.forEach(zoneData => {
                const layer = L.polygon(zoneData.points, {
                    color: zoneData.color,
                    fillColor: zoneData.color,
                    fillOpacity: 0.3,
                    weight: 2
                });
                
                // Store the zone
                dangerZones.push({
                    id: zoneData.id,
                    name: zoneData.name,
                    layer: layer,
                    dangerLevel: zoneData.level
                });
                
                // Add to map
                drawnItems.addLayer(layer);
                
                // Add popup with zone info
                layer.bindPopup(`<b>${zoneData.name}</b><br>${zoneData.description}`);
            });
            
            if (zonesData.length > 0) {
                addLogEntry('info', `Loaded ${zonesData.length} zones from storage.`);
            }
        }
        
        // Helper function to get color for danger level
        function getColorForLevel(level) {
            switch(level) {
                case 1: return '#00ff00';
                case 2: return '#ffff00';
                case 3: return '#ff9900';
                case 4: return '#ff0000';
                default: return '#00cccc';
            }
        }
        
        // Helper function to get danger level name
        function getDangerLevelName(level) {
            switch(level) {
                case 1: return 'Low';
                case 2: return 'Moderate';
                case 3: return 'High';
                case 4: return 'Extreme';
                default: return 'Unknown';
            }
        }
        
        // Login functionality
        loginBtn.addEventListener('click', function() {
            const username = usernameInput.value;
            const password = passwordInput.value;
            
            if (username === 'admin' && password === 'password') {
                loginContainer.style.display = 'none';
                adminContainer.style.display = 'flex';
                consoleInput.focus();
                addLogEntry('success', 'Login successful. Welcome, admin.');
                
                // Initialize the map after login
                setTimeout(function() {
                    initMap();
                    // Start detecting user's location
                    detectLocation();
                }, 100);
            } else {
                alert('Invalid credentials. Use admin/password');
            }
        });
        
        // Logout functionality
        logoutBtn.addEventListener('click', function() {
            adminContainer.style.display = 'none';
            loginContainer.style.display = 'flex';
            
            // Stop tracking location
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
            
            // Remove user location marker
            if (userLocationMarker) {
                map.removeLayer(userLocationMarker);
            }
            
            // Remove the map
            if (map) {
                map.remove();
            }
        });
        
        // Add event listener for Enter key
        consoleInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = consoleInput.value.trim();
                consoleInput.value = '';
                
                if (command) {
                    // Display the command
                    addLogEntry('command', command);
                    
                    // Process the command
                    processCommand(command);
                }
            }
        });
        
        // Detect location button
        detectLocationBtn.addEventListener('click', function() {
            detectLocation();
        });
        
        // Create zone button
        createZoneBtn.addEventListener('click', function() {
            // Enable drawing mode for polygon
            new L.Draw.Polygon(map, drawControl.options.draw.polygon).enable();
            addLogEntry('info', 'Drawing mode enabled. Click on the map to start drawing a zone.');
        });
        
        // Show all zones button
        showAllZonesBtn.addEventListener('click', function() {
            if (dangerZones.length > 0) {
                const bounds = new L.LatLngBounds();
                dangerZones.forEach(zone => {
                    bounds.extend(zone.layer.getBounds());
                });
                map.fitBounds(bounds);
                addLogEntry('info', 'Showing all danger zones.');
            } else {
                addLogEntry('warning', 'No zones created yet.');
            }
        });
        
        // Clear all zones button
        clearZonesBtn.addEventListener('click', function() {
            if (confirm("Are you sure you want to clear all zones?")) {
                dangerZones = [];
                drawnItems.clearLayers();
                localStorage.removeItem('adminDangerZones');
                addLogEntry('info', 'All zones cleared.');
            }
        });
        
        // Function to detect user's location
        function detectLocation() {
            if (!navigator.geolocation) {
                addLogEntry('error', 'Geolocation is not supported by your browser.');
                return;
            }
            
            addLogEntry('info', 'Detecting your location...');
            
            // Stop any previous watching
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
            
            // Get current position
            navigator.geolocation.getCurrentPosition(
                position => {
                    showPosition(position);
                    // Continue watching position
                    watchId = navigator.geolocation.watchPosition(
                        showPosition,
                        showError,
                        { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
                    );
                },
                showError,
                { enableHighAccuracy: true }
            );
        }
        
        // Function to show user's position
        function showPosition(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            // Update location details
            locationDetails.innerHTML = `
                <strong>Latitude:</strong> ${lat.toFixed(6)}<br>
                <strong>Longitude:</strong> ${lng.toFixed(6)}<br>
                <strong>Accuracy:</strong> ${accuracy.toFixed(2)} meters
            `;
            
            userLocationSpan.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            
            // Remove previous marker if exists
            if (userLocationMarker) {
                map.removeLayer(userLocationMarker);
            }
            
            // Add marker for user's location
            userLocationMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'location-marker',
                    html: '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: #3399ff;"></div>',
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                })
            }).addTo(map);
            
            // Add accuracy circle
            // L.circle([lat, lng], { radius: accuracy }).addTo(map);
            
            // Center map on user's location if it's the first time
            if (map.getZoom() < 10) {
                map.setView([lat, lng], 15);
            }
            
            addLogEntry('success', `Location detected: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
        
        // Function to handle geolocation errors
        function showError(error) {
            let errorMessage;
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    errorMessage = "The request to get user location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    errorMessage = "An unknown error occurred.";
                    break;
            }
            
            addLogEntry('error', errorMessage);
            locationDetails.innerHTML = errorMessage;
        }
        
        // Function to add log entries to the console
        function addLogEntry(type, message) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            
            const span = document.createElement('span');
            span.className = type;
            span.textContent = message;
            
            entry.appendChild(span);
            consoleOutput.appendChild(entry);
            
            // Scroll to bottom
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }
        
        // Function to process commands
        function processCommand(command) {
            const parts = command.split(' ');
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);
            
            switch(cmd) {
                case 'help':
                    showHelp();
                    break;
                    
                case 'create':
                    if (args.length < 1) {
                        addLogEntry('error', 'Usage: create [zone_name]');
                        return;
                    }
                    startZoneCreation(args.join(' '));
                    break;
                    
                case 'setlevel':
                    if (args.length < 2) {
                        addLogEntry('error', 'Usage: setlevel [zone_name] [1-4]');
                        return;
                    }
                    setDangerLevel(args[0], parseInt(args[1]));
                    break;
                    
                case 'list':
                    listZones();
                    break;
                    
                case 'delete':
                    if (args.length < 1) {
                        addLogEntry('error', 'Usage: delete [zone_name]');
                        return;
                    }
                    deleteZone(args.join(' '));
                    break;
                    
                case 'clear':
                    clearConsole();
                    break;
                    
                case 'locate':
                    detectLocation();
                    break;
                    
                case 'zoom':
                    if (args.length === 1) {
                        const zoomLevel = parseInt(args[0]);
                        if (!isNaN(zoomLevel) && zoomLevel >= 0 && zoomLevel <= 18) {
                            map.setZoom(zoomLevel);
                            addLogEntry('success', `Zoom level set to ${zoomLevel}`);
                        } else {
                            addLogEntry('error', 'Zoom level must be between 0 and 18');
                        }
                    } else {
                        addLogEntry('error', 'Usage: zoom [level]');
                    }
                    break;
                    
                default:
                    addLogEntry('error', `Unknown command: ${cmd}. Type 'help' for available commands.`);
            }
        }
        
        // Command functions
        function showHelp() {
            addLogEntry('info', 'Available commands:');
            addLogEntry('info', '  help - Show this help message');
            addLogEntry('info', '  create [name] - Start creating a zone with the given name');
            addLogEntry('info', '  setlevel [name] [1-4] - Set danger level for a zone');
            addLogEntry('info', '  list - List all created zones');
            addLogEntry('info', '  delete [name] - Delete a zone');
            addLogEntry('info', '  locate - Detect and center on your location');
            addLogEntry('info', '  zoom [level] - Set zoom level (0-18)');
            addLogEntry('info', '  clear - Clear the console');
        }
        
        function startZoneCreation(name) {
            addLogEntry('info', `Click on the map to start drawing zone: ${name}`);
            
            // Enable drawing mode for polygon
            new L.Draw.Polygon(map, drawControl.options.draw.polygon).enable();
        }
        
        function setDangerLevel(name, level) {
            if (level < 1 || level > 4) {
                addLogEntry('error', 'Danger level must be between 1 and 4.');
                return;
            }
            
            const zone = dangerZones.find(z => z.name.toLowerCase() === name.toLowerCase());
            
            if (!zone) {
                addLogEntry('error', `Zone "${name}" not found.`);
                return;
            }
            
            zone.dangerLevel = level;
            updateZoneStyle(zone.id, level);
            
            // Update popup
            const levelNames = ['Low', 'Moderate', 'High', 'Extreme'];
            zone.layer.setPopupContent(`<b>${zone.name}</b><br>Danger Level: ${level} (${levelNames[level-1]})`);
            
            // Save to localStorage
            saveZonesToLocalStorage();
            
            addLogEntry('success', `Danger level for zone "${name}" set to ${level}.`);
        }
        
        function updateZoneStyle(zoneId, level) {
            const zone = dangerZones.find(z => z.id === zoneId);
            
            if (!zone) return;
            
            const colors = ['#00ff00', '#ffff00', '#ff9900', '#ff0000'];
            
            zone.layer.setStyle({
                fillColor: colors[level-1],
                color: colors[level-1]
            });
        }
        
        function listZones() {
            if (dangerZones.length === 0) {
                addLogEntry('info', 'No zones created yet.');
                return;
            }
            
            addLogEntry('info', 'Created zones:');
            
            dangerZones.forEach(zone => {
                const levelNames = ['Low', 'Moderate', 'High', 'Extreme'];
                addLogEntry('info', `- ${zone.name}: Danger Level ${zone.dangerLevel} (${levelNames[zone.dangerLevel-1]})`);
            });
        }
        
        function deleteZone(name) {
            const index = dangerZones.findIndex(z => z.name.toLowerCase() === name.toLowerCase());
            
            if (index === -1) {
                addLogEntry('error', `Zone "${name}" not found.`);
                return;
            }
            
            const zone = dangerZones[index];
            drawnItems.removeLayer(zone.layer);
            dangerZones.splice(index, 1);
            
            // Save to localStorage
            saveZonesToLocalStorage();
            
            addLogEntry('success', `Zone "${name}" deleted successfully.`);
        }
        
        function clearConsole() {
            consoleOutput.innerHTML = '';
            addLogEntry('info', 'Console cleared.');
        }
        
        // Initialize with some example text
        addLogEntry('info', 'Welcome to the Danger Zone Mapper Admin Console.');
        addLogEntry('info', 'Your location is being detected automatically.');
        // ===== Existing browser-based admin UI code remains above =====

// ===== Append WebSocket client code to receive user locations =====
        let socket;
        const userMarkers = {}; // store markers by userId

        function initWebSocket() {
            socket = new WebSocket("ws://localhost:3000"); // Adjust server address if needed

            socket.addEventListener("open", () => {
                console.log("✅ Connected to WebSocket server");
                socket.send(JSON.stringify({ type: "login", userId: "admin" }));
            });

            socket.addEventListener("message", (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === "location") {
                        const { userId, lat, lng, accuracy } = data;

                        // remove old marker if exists
                        if (userMarkers[userId]) {
                            map.removeLayer(userMarkers[userId].marker);
                            map.removeLayer(userMarkers[userId].circle);
                        }

                        // add new marker
                        const marker = L.marker([lat, lng], {
                            icon: L.divIcon({
                                className: 'user-marker',
                                html: `<div style="width:14px;height:14px;border-radius:50%;background:#ff6600;"></div>`
                            })
                        }).addTo(map);

                        const circle = L.circle([lat, lng], {
                            radius: accuracy,
                            color: '#ff6600',
                            fillColor: '#ff6600',
                            fillOpacity: 0.15,
                            weight: 1
                        }).addTo(map);

                        marker.bindPopup(`<b>User:</b> ${userId}<br><b>Lat:</b> ${lat.toFixed(5)}<br><b>Lng:</b> ${lng.toFixed(5)}`);

                        userMarkers[userId] = { marker, circle };

                        addLogEntry('info', `📍 Updated location for ${userId}: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                    }
                } catch (e) {
                    console.error("❌ Error parsing WebSocket message", e);
                }
            });

            socket.addEventListener("close", () => {
                console.log("❌ Disconnected from WebSocket server");
            });

            socket.addEventListener("error", (err) => {
                console.error("⚠️ WebSocket error:", err);
            });
        }

        // Initialize WebSocket after login
        loginBtn.addEventListener('click', function() {
            const username = usernameInput.value;
            const password = passwordInput.value;

            if (username === 'admin' && password === 'password') {
                loginContainer.style.display = 'none';
                adminContainer.style.display = 'flex';
                consoleInput.focus();
                addLogEntry('success', 'Login successful. Welcome, admin.');

                setTimeout(function() {
                    initMap();
                    detectLocation();
                    initWebSocket(); // connect to server
                }, 100);
            } else {
                alert('Invalid credentials. Use admin/password');
            }
        });
                