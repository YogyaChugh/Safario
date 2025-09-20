// DOM elements
        const userContainer = document.getElementById('userContainer');
        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const usernameInput = document.getElementById('username');
        const locationDetails = document.getElementById('locationDetails');
        const userLocationSpan = document.getElementById('userLocation');
        const refreshZonesBtn = document.getElementById('refreshZonesBtn');
        const updateLocationBtn = document.getElementById('updateLocationBtn');
        const statusMessage = document.getElementById('statusMessage');
        const lastUpdate = document.getElementById('lastUpdate');
        const userIdDisplay = document.getElementById('userIdDisplay');
        const statusSpan = document.getElementById('status');
        
        // Initialize the map variable
        let map;
        let userLocationMarker = null;
        let watchId = null;
        let userId = null;
        let dangerZones = [];
        let insideZone = false;
        const sirenAudio = new Audio("siren.mp3");

        // WebSocket variable
        let socket = null;
        let proximityWarningShown = false;
        const PROXIMITY_DISTANCE = 500; 
        
        // function isPointInPolygon(point, vs) {
        //     const x = point.lat, y = point.lng;
        //     let inside = false;
            
        //     for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        //         const xi = vs[i].lat, yi = vs[i].lng;
        //         const xj = vs[j].lat, yj = vs[j].lng;
                
        //         const intersect = ((yi > y) !== (yj > y)) &&
        //             (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        //         if (intersect) inside = !inside;
        //     }
        //     return inside;
        // }


        // Custom icon for user location
        // const userLocationIcon = L.divIcon({
        //     className: 'current-location-marker',
        //     html: '<div class="location-pointer"></div>',
        //     iconSize: [40, 40],
        //     iconAnchor: [20, 40]
        // });
        
        // Login functionality
        loginBtn.addEventListener('click', function() {
            const username = usernameInput.value;
            
            if (username) {
                loginForm.style.display = 'none';
                userContainer.style.display = 'flex';
                
                // Generate a user ID if not exists
                userId = localStorage.getItem('userId') || 'user_' + Math.floor(Math.random() * 10000);
                localStorage.setItem('userId', userId);
                userIdDisplay.textContent = `ID: ${userId}`;

                // Initialize WebSocket connection
                socket = new WebSocket("ws://localhost:3000"); // replace with your server URL

                socket.addEventListener("open", () => {
                    console.log("WebSocket connected");
                    socket.send(JSON.stringify({ type: "login", userId }));
                });

                socket.addEventListener("close", () => {
                    console.log("WebSocket disconnected");
                });

                socket.addEventListener("error", (err) => {
                    console.error("WebSocket error:", err);
                });
                
                // Initialize the map after login
                setTimeout(function() {
                    initMap();
                    // Start detecting user's location
                    detectLocation();
                }, 100);
            } else {
                alert('Please enter a username');
            }
        });
        
        // Function to initialize the map
        function initMap() {
            // Initialize the map with a default view
            map = L.map('map').setView([0, 0], 2);
            
            // Add base tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Load danger zones from localStorage (simulating server)
            loadDangerZones();
            
            // Add event listener for when the map is clicked
            map.on('click', function(e) {
                console.log(`Map clicked at: ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);
            });
        }
        
        // Refresh zones button
        refreshZonesBtn.addEventListener('click', function() {
            loadDangerZones();
            statusMessage.textContent = "Status: Zones refreshed";
            lastUpdate.textContent = "Last update: " + new Date().toLocaleTimeString();
        });
        
        // Update location button
        updateLocationBtn.addEventListener('click', function() {
            detectLocation();
            statusMessage.textContent = "Status: Location updated";
            lastUpdate.textContent = "Last update: " + new Date().toLocaleTimeString();
        });
        
        // Function to detect user's location
        function detectLocation() {
            if (!navigator.geolocation) {
                statusMessage.textContent = "Status: Geolocation not supported";
                return;
            }
            
            statusMessage.textContent = "Status: Detecting location...";
            
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
        
        
        // Function to load danger zones from localStorage (simulating server)
        function loadDangerZones() {
            // In a real application, this would be an API call to the server
            // For this demo, we'll use localStorage to simulate communication
            const zonesData = JSON.parse(localStorage.getItem('adminDangerZones') || '[]');
            dangerZones = zonesData;
            
            // Clear existing zones from map
            map.eachLayer(layer => {
                if (layer instanceof L.Polygon) {
                    map.removeLayer(layer);
                }
            });
            
            if (zonesData.length === 0) {
                statusMessage.textContent = "Status: No danger zones defined by admin";
                return;
            }
            
            // Add zones to map
            zonesData.forEach(zone => {
                const polygon = L.polygon(zone.points, {
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: 0.3,
                    weight: 2
                }).addTo(map);
                
                // Add popup with zone info
                polygon.bindPopup(`
                    <b>${zone.name}</b><br>
                    Danger Level: ${zone.level} (${getDangerLevelName(zone.level)})<br>
                    ${zone.description || ''}
                `);
            });
            
            statusMessage.textContent = `Status: Loaded ${zonesData.length} danger zones`;
            lastUpdate.textContent = "Last update: " + new Date().toLocaleTimeString();
            // inspectDangerZones();
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
            
            statusMessage.textContent = "Status: " + errorMessage;
            locationDetails.innerHTML = errorMessage;
        }
        
        // Initialize with sample danger zones if none exist
        if (!localStorage.getItem('adminDangerZones')) {
            const sampleZones = [
                {
                    name: "Construction Area",
                    level: 2,
                    color: "#ffff00",
                    points: [[51.505, -0.09], [51.51, -0.1], [51.51, -0.08]]
                },
                {
                    name: "High Crime Area",
                    level: 4,
                    color: "#ff0000",
                    points: [[51.52, -0.11], [51.53, -0.12], [51.53, -0.10], [51.52, -0.10]]
                }
            ];
            localStorage.setItem('adminDangerZones', JSON.stringify(sampleZones));
        }
        // Utility: check if point is inside polygon
        // function isPointInPolygon(point, polygon) {
        //     return L.polygon(polygon).getBounds().contains(point);
        // }

        // function inspectDangerZones() {
        //     console.log("=== DANGER ZONES INSPECTION ===");
            
        //     if (!dangerZones || dangerZones.length === 0) {
        //         console.log("No danger zones found!");
        //         return;
        //     }
            
        //     console.log("Number of danger zones:", dangerZones.length);
            
        //     dangerZones.forEach((zone, zoneIndex) => {
        //         console.log(`\n--- Zone ${zoneIndex}: ${zone.name || 'Unnamed'} ---`);
        //         console.log("Full zone object:", zone);
                
        //         if (!zone.points || !Array.isArray(zone.points)) {
        //             console.error("❌ Zone points is not an array or doesn't exist!");
        //             return;
        //         }
                
        //         console.log("Number of points:", zone.points.length);
                
        //         zone.points.forEach((point, pointIndex) => {
        //             console.log(`  Point ${pointIndex}:`, point);
        //             console.log(`    Type: ${typeof point}`);
                    
        //             if (typeof point === 'object' && point !== null) {
        //                 console.log(`    lat: ${point.lat} (type: ${typeof point.lat})`);
        //                 console.log(`    lng: ${point.lng} (type: ${typeof point.lng})`);
                        
        //                 // Check if coordinates are valid numbers
        //                 const latValid = typeof point.lat === 'number' && !isNaN(point.lat);
        //                 const lngValid = typeof point.lng === 'number' && !isNaN(point.lng);
                        
        //                 console.log(`    Valid coordinates: ${latValid && lngValid}`);
        //                 if (!latValid || !lngValid) {
        //                     console.error("❌ INVALID COORDINATES!");
        //                 }
        //             } else {
        //                 console.error("❌ Point is not an object!");
        //             }
        //         });
        //     });
        // }
        function isPointInPolygon(point, polygonPoints) {
            const x = point.lat, y = point.lng;
            let inside = false;
            
            for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
                const xi = polygonPoints[i][0]; // latitude
                const yi = polygonPoints[i][1]; // longitude
                const xj = polygonPoints[j][0]; // latitude  
                const yj = polygonPoints[j][1]; // longitude
                
                const intersect = ((yi > y) !== (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        }

        function calculateDistance(lat1, lng1, lat2, lng2) {
            const R = 6371000; // Earth radius in meters
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }

        function distanceToPolygon(userPoint, polygonPoints) {
            let minDistance = Infinity;
            
            polygonPoints.forEach(point => {
                // point is an array [lat, lng]
                const distance = calculateDistance(
                    userPoint.lat, userPoint.lng,
                    point[0], point[1]  // point[0] = lat, point[1] = lng
                );
                minDistance = Math.min(minDistance, distance);
            });
            
            return minDistance;
        }

        function checkDangerZones(lat, lng) {
            // if (lat === 0 && lng === 0) return;
            if (lat === 0 && lng === 0) return; // Skip default coordinates
            if (!map || !map.getCenter) return; // Skip if map not ready
            if (!dangerZones || dangerZones.length === 0) return;

            let userPoint = { lat: lat, lng: lng };
            let enteredAnyZone = false;
            let inProximity = false;
            let closestZoneName = "";
            let closestDistance = Infinity;

            dangerZones.forEach(zone => {
                // Check if inside zone
                if (isPointInPolygon(userPoint, zone.points)) {
                    // enteredAnyZone = true;
                    // console.log("INSIDE zone:", zone.name);
                    enteredAnyZone = true;
                    console.log("Unsafe zone entered:", zone.name);

                    L.popup()
                        .setLatLng([lat, lng])
                        .setContent(`⚠️ You have entered: ${zone.name} (Level ${zone.level}) - Please act accordingly!`)
                        .openOn(map);
                }
                
                // Check proximity (500m)
                const distance = distanceToPolygon(userPoint, zone.points);
                console.log(`Distance to ${zone.name}: ${Math.round(distance)}m`);
                
                if (distance < PROXIMITY_DISTANCE && distance < closestDistance) {
                    inProximity = true;
                    closestDistance = distance;
                    closestZoneName = zone.name;
                }
                });

                // Handle actual zone entry
                if (enteredAnyZone && !insideZone) {
                    insideZone = true;
                    proximityWarningShown = false; // Reset proximity warning
                    sirenAudio.loop = true;
                    sirenAudio.play().catch(err => {
                        console.warn("Autoplay blocked:", err);
                        alert(`🚨 DANGER! You entered a danger zone!`);
                    });
                } else if (!enteredAnyZone && insideZone) {
                    insideZone = false;
                    sirenAudio.pause();
                    sirenAudio.currentTime = 0;
                    map.closePopup();
                }
                if (inProximity && !proximityWarningShown && !insideZone) {
                    proximityWarningShown = true;
                    // showProximityWarning(closestZoneName, Math.round(closestDistance));
                    showProximityWarning(closestZoneName, Math.round(closestDistance), lat, lng);
                } else if (!inProximity && proximityWarningShown) {
                    proximityWarningShown = false;
                }

                
        }

        function showProximityWarning(zoneName, distance, lat, lng) {
            // Show browser alert
            alert(`⚠️ WARNING: You are ${distance}m away from "${zoneName}"!`);
            
            // Also show map popup at user's current location
            if (map && typeof map.openPopup === 'function') {
                L.popup()
                    .setLatLng([lat, lng])
                    .setContent(`
                        <div style="text-align: center; padding: 10px;">
                            <h3 style="color: #ff9900; margin: 0;">⚠️ PROXIMITY WARNING</h3>
                            <p style="margin: 5px 0;">You are <strong>${distance}m</strong> away from:</p>
                            <p style="margin: 5px 0; font-weight: bold;">${zoneName}</p>
                            <p style="margin: 5px 0; font-size: 12px; color: #666;">Please proceed with caution</p>
                        </div>
                    `)
                    .openOn(map);
            }
        }

        // Modify showPosition function (near bottom of your file):
        function showPosition(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            console.log(`LAT=${lat}`)

            // (existing code updating marker, accuracy circle, status, WebSocket...)
            console.log("Updating locationDetails element:", locationDetails);
            console.log("Coordinates:", lat, lng);
            
            // Update location details
            locationDetails.innerHTML = `
                <strong>Latitude:</strong> ${lat.toFixed(6)}<br>
                <strong>Longitude:</strong> ${lng.toFixed(6)}<br>
                <strong>Accuracy:</strong> ${accuracy.toFixed(2)} meters
            `;
            console.log("Element after update:", locationDetails.innerHTML);
            
            userLocationSpan.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            
            // Remove previous marker if exists
            if (userLocationMarker) {
                map.removeLayer(userLocationMarker);
            }
            
            // Add marker for user's location with custom icon
            // userLocationMarker = L.marker([lat, lng], {
            //     icon: userLocationIcon,
            //     zIndexOffset: 1000
            // }).addTo(map);
             userLocationMarker = L.marker([lat, lng], {
                zIndexOffset: 1000 
            }).addTo(map);
            // Add accuracy circle
            // L.circle([lat, lng], { 
            //     radius: accuracy,
            //     color: '#3399ff',
            //     fillColor: '#3399ff',
            //     fillOpacity: 0.2,
            //     weight: 1
            // }).addTo(map);
            
            // Center map on user's location if it's the first time
            if (map.getZoom() < 10) {
                map.setView([lat, lng], 15);
            }
            
            statusMessage.textContent = "Status: Location updated";
            lastUpdate.textContent = "Last update: " + new Date().toLocaleTimeString();

            // 📡 Send location to server via WebSocket
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "location",
                    userId,
                    lat,
                    lng,
                    accuracy,
                    timestamp: new Date().toISOString()
                }));
            }
            checkDangerZones(lat, lng);
            // 📡 Zone check
            // if (dangerZones && dangerZones.length > 0) {
            //     // let userLatLng = L.latLng(lat, lng);
            //     let userPoint = { lat: lat, lng: lng };
            //     let enteredAnyZone = false;

            //     dangerZones.forEach(zone => {
            //          // Create a LatLng array for the polygon points
            //         // const polygonPoints = zone.points.map(point => L.latLng(point.lat, point.lng));
            //         if (isPointInPolygon(userPoint, zone.points)) {
            //             enteredAnyZone = true;
            //             console.log("Unsafe zone entered");

            //             // Show popup at user location
            //             L.popup()
            //                 .setLatLng([lat, lng])
            //                 .setContent(` You have entered: ${zone.name} (Level ${zone.level}) pls act accordingly`)
            //                 .openOn(map);
            //         }
            //     });

            //     if (enteredAnyZone && !insideZone) {
            //         insideZone = true;
            //         sirenAudio.loop = true; // continuous siren
            //         sirenAudio.play().catch(err => console.warn("Autoplay blocked:", err));
            //     } else if (!enteredAnyZone && insideZone) {
            //         insideZone = false;
            //         sirenAudio.pause();
            //         sirenAudio.currentTime = 0;
            //         // checkDangerZones(lat, lng);
            //     }
            //     // else{
            //     //     checkDangerZones(lat, lng);
            //     // }
            // }
        }