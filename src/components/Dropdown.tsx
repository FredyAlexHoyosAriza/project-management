"use client";
import React from "react";

// Definición de la interfaz para las opciones del menú
interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Definición de las propiedades del Dropdown
interface DropdownProps {
  id: string;
  name: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Record<string, string>; // Ahora options es un objeto
  required?: boolean;
  label: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  name,
  className,
  value,
  onChange,
  options,
  required,
  label,
}) => {
  // Convertimos el objeto options en un array con el formato necesario
  const menuOptions: DropdownOption[] = [
    { value: "", label: "Seleccione una opción", disabled: true },
    ...Object.entries(options).map(([value, label]) => ({ value, label })),
  ];

  return (
    <label htmlFor={id} className="block mb-1">
      <span className="inline-block pl-2">{label}</span>
      <select
        id={id}
        name={name}
        className={className}
        value={value}
        onChange={onChange}
        required={required}
      >
        {menuOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled || false} // Asegurar que disabled siempre esté presente
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Dropdown;
