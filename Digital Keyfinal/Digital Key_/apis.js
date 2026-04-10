// apis.js - Funciones para Digital Key
const WHATSAPP_NUMBER = '524641977737';

function abrirWhatsApp(mensaje = 'Hola, me interesa conocer más sobre Digital Key') {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}