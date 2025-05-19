import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();
let externalShowAlert = () => {};

export const useAlert = () => useContext(AlertContext);
export const showGlobalAlert = (message) => externalShowAlert(message);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ message: '', visible: false });

  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => {
      setAlert({ message: '', visible: false });
    }, 1000); // Changed back to 3 seconds
  };

  externalShowAlert = showAlert;

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.visible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start', // Align alert to the top
            paddingTop: '60px', // Space from top
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '8px',
              fontSize: '18px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              maxWidth: '90%',
              textAlign: 'center',
            }}
          >
            {alert.message}
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
