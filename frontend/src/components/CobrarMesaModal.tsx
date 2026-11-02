import React, { useState } from 'react';

interface CobrarMesaModalProps {
  mesaId: number;
  totalMesa: number;
  onClose: () => void;
  onPagoExitoso: () => void;
}

export const CobrarMesaModal: React.FC<CobrarMesaModalProps> = ({ mesaId, totalMesa, onClose, onPagoExitoso }) => {
  const [metodo, setMetodo] = useState<'efectivo' | 'yape'>('yape');
  const [procesando, setProcesando] = useState(false);

  const handleConfirmarCobro = async () => {
    setProcesando(true);
    try {
      const response = await fetch('/api/ventas/cobrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Token JWT del sistema
        },
        body: JSON.stringify({
          mesaId,
          total: totalMesa,
          metodoPago: metodo,
          referenciaYape: metodo === 'yape' ? '61788877' : null
        })
      });

      if (response.ok) {
        onPagoExitoso();
        onClose();
      } else {
        alert('Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 font-cinzel">Cobrar Mesa #{mesaId}</h2>
        <p className="text-lg mb-2">Total a pagar: <span className="font-bold text-green-600">{totalMesa} Bs</span></p>
        
        {/* Selector de Método de Pago */}
        <div className="flex gap-4 my-4">
          <button 
            className={`px-4 py-2 rounded ${metodo === 'yape' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setMetodo('yape')}
          >
            Yape 💜
          </button>
          <button 
            className={`px-4 py-2 rounded ${metodo === 'efectivo' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setMetodo('efectivo')}
          >
            Efectivo 💵
          </button>
        </div>

        {/* Si selecciona Yape, mostramos los datos simulados del QR */}
        {metodo === 'yape' && (
          <div className="border border-purple-300 p-4 rounded text-center my-4 bg-purple-50">
            <p className="text-sm font-semibold text-purple-800 mb-2">Escanea para pagar con Yape</p>
            {/* Aquí puedes poner una imagen estática de un QR genérico o simular el contenedor */}
            <div className="w-32 h-32 mx-auto bg-gray-300 flex items-center justify-center text-xs text-gray-600 mb-2">
              [QR YAPE - {totalMesa} Bs]
            </div>
            <p className="text-xs text-gray-700">Celular asociado: <b>617888**</b></p>
            <p className="text-xs text-gray-500">RestoBar Biergarten Hauss</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button 
            onClick={handleConfirmarCobro} 
            disabled={procesando}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 font-semibold"
          >
            {procesando ? 'Procesando...' : 'Confirmar Pago y Liberar Mesa'}
          </button>
        </div>
      </div>
    </div>
  );
};