interface ModalAddCityProps {
  isVisible: boolean;
  onClose: () => void;
  onCitySelect: (city: string) => void;
}

export default ModalAddCityProps;
