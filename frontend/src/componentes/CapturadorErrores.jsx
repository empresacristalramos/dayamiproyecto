/**
 * ErrorBoundary - Capturador de Errores Seguro
 * Si algún componente falla, no deja la pantalla en blanco;
 * muestra un aviso amigable con botón de reinicio.
 */
import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class CapturadorErrores extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tieneError: false, mensajeError: '' };
  }

  static getDerivedStateFromError(error) {
    return { tieneError: true, mensajeError: error?.message || 'Error inesperado' };
  }

  componentDidCatch(error, info) {
    console.error("Capturado por CapturadorErrores:", error, info);
  }

  reiniciar = () => {
    this.setState({ tieneError: false });
    window.location.reload();
  };

  render() {
    if (this.state.tieneError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0508',
          color: '#fff',
          padding: '20px',
          textAlign: 'center'
        }}>
          <AlertTriangle size={50} color="#f43f5e" style={{ marginBottom: '15px' }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>¡Ups! Ocurrió un detalle técnico</h2>
          <p style={{ color: '#fda4af', maxWidth: '400px', fontSize: '0.9rem', marginBottom: '20px' }}>
            No te preocupes, tus puntos están a salvo. Presiona el botón para continuar jugando:
          </p>
          <button
            onClick={this.reiniciar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#e11d48',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={18} /> Reiniciar Juego
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
