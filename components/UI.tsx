
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success', 
  size?: 'sm' | 'md' | 'lg',
  isLoading?: boolean 
}> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const variants = {
    primary: "bg-primary text-white hover:bg-slate-800 focus:ring-slate-900",
    secondary: "bg-accent text-primary hover:bg-amber-400 focus:ring-amber-500",
    danger: "bg-danger text-white hover:bg-red-700 focus:ring-red-600",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
    success: "bg-success text-white hover:bg-green-700 focus:ring-green-600"
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let styles = "bg-slate-100 text-slate-800";
  if (status === 'Paid') styles = "bg-green-100 text-green-800 border border-green-200";
  if (status === 'Overdue') styles = "bg-red-100 text-red-800 border border-red-200";
  if (status === 'Unpaid') styles = "bg-slate-100 text-slate-600 border border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <input 
      className={`w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border ${className}`}
      {...props}
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <select 
      className={`w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

export const PageHeader: React.FC<{ title: string, description?: string, children?: React.ReactNode }> = ({ title, description, children }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-primary">{title}</h2>
      {description && <p className="text-slate-500 mt-1 text-sm md:text-base">{description}</p>}
    </div>
    <div className="flex flex-wrap items-center gap-3">
      {children}
    </div>
  </div>
);

export const Toast: React.FC<{ message: string, type: 'success' | 'error', onClose: () => void }> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 left-4 md:left-auto px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 flex items-center justify-between space-x-2 animate-fade-in-up ${type === 'success' ? 'bg-success' : 'bg-danger'}`}>
      <span className="truncate">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80 shrink-0"><span className="text-lg">×</span></button>
    </div>
  );
};
