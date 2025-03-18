
import React from 'react';

interface StockModalProps {
  closeModal: () => void;
}

const StockModal: React.FC<StockModalProps> = ({ closeModal }) => {
  return (
    <div>
      test modal
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default StockModal;