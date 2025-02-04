"use client";
import React from "react";

// Componente Input
interface InputProps {
  id: string;
  name: string;
  type?: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  label: string;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = "text",
  className,
  value,
  onChange,
  required,
  label,
}) => {
  return (
    <label htmlFor={id} className="block mb-1">
      <span className="inline-block pl-2">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        className={className}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
};
export default Input;
