// apis.js - Módulo para manejar las APIs externas

// ============================================
// 1. API de Tipo de Cambio (ExchangeRate-API)
// ============================================
async function cargarTipoCambio() {
    const URL = 'https://api.exchangerate-api.com/v4/latest/USD';
    try {
        const response = await fetch(URL);
        const data = await response.json();
        const tipoCambio = data.rates.MXN;
        document.getElementById('tipo-cambio').innerText = `$ ${tipoCambio.toFixed(2)} MXN`;
    } catch (error) {
        console.error('Error al obtener tipo de cambio:', error);
        document.getElementById('tipo-cambio').innerText = 'No disponible';
    }
}

// ============================================
// 2. Geolocalización y Mapa con Leaflet
// ============================================
function iniciarMapa() {
    // Coordenadas de las sucursales reales en Guanajuato
    const sucursales = [
        { nombre: 'Celaya (Blvd. López Mateos)', lat: 20.525, lng: -100.815, direccion: 'Blvd. Adolfo López Mateos 201, Celaya', horario: 'Lun-Sáb 9am-6pm' },
        { nombre: 'Celaya (Centro)', lat: 20.522, lng: -100.812, direccion: 'Benito Juárez 441, Zona Centro, Celaya', horario: 'Lun-Sáb 9am-6pm' },
        { nombre: 'San Miguel de Allende', lat: 20.914, lng: -100.744, direccion: 'Orizaba 38, Col. San Antonio, San Miguel de Allende', horario: 'Lun-Sáb 9am-6pm' },
        { nombre: 'Salamanca', lat: 20.571, lng: -101.191, direccion: 'Calle Felipe Ángeles, Salamanca (ambulante)', horario: 'Solo sábados 8am-5pm' }
    ];

    // Inicializar mapa centrado en Celaya
    const map = L.map('map').setView([20.525, -100.815], 10);

    // Capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Añadir marcadores
    sucursales.forEach(s => {
        const marker = L.marker([s.lat, s.lng]).addTo(map);
        marker.bindPopup(`<b>${s.nombre}</b><br>${s.direccion}<br>${s.horario}`);
    });

    // Intentar obtener ubicación del usuario para calcular distancia
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;
            // Calcular distancias a cada sucursal (fórmula de Haversine)
            const distancias = sucursales.map(s => {
                const R = 6371; // Radio de la Tierra en km
                const dLat = (s.lat - userLat) * Math.PI / 180;
                const dLon = (s.lng - userLng) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                          Math.cos(userLat * Math.PI / 180) * Math.cos(s.lat * Math.PI / 180) *
                          Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const d = R * c;
                return { ...s, distancia: d.toFixed(1) };
            });
            // Ordenar por distancia y mostrar la más cercana
            const masCercana = distancias.sort((a,b) => a.distancia - b.distancia)[0];
            document.getElementById('sucursal-cercana').innerHTML = 
                `📍 Sucursal más cercana: <strong>${masCercana.nombre}</strong> (a ${masCercana.distancia} km)`;
        }, () => {
            document.getElementById('sucursal-cercana').innerHTML = '📍 No se pudo obtener tu ubicación';
        });
    } else {
        document.getElementById('sucursal-cercana').innerHTML = '📍 Geolocalización no soportada';
    }
}

// ============================================
// 3. Función mejorada para WhatsApp
// ============================================
function abrirWhatsApp(producto, origen = 'Lapcel') {
    const telefono = '524611113753';
    let mensaje = `Hola, me interesa información sobre `;
    if (producto) {
        mensaje += `el producto: ${producto}`;
    } else {
        mensaje += `sus productos y servicios.`;
    }
    mensaje += ` (desde ${origen})`;
    
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarTipoCambio();
    iniciarMapa();
});