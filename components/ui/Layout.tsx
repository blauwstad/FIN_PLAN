import React from 'react';
import { clsx } from 'clsx';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={clsx("bg-white rounded-xl border border-slate-200 shadow-sm p-6", className)}>
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1.5">
    {children}
  </label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { error?: string }> = ({ error, className, ...props }) => (
  <div className="w-full">
    <input 
      {...props} 
      className={clsx(
        "block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border",
        error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "",
        className
      )} 
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }> = ({ error, className, ...props }) => (
  <div className="w-full">
    <textarea 
      {...props} 
      className={clsx(
        "block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border",
        error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "",
        className
      )} 
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }> = ({ error, className, children, ...props }) => (
  <div className="w-full">
    <select 
      {...props} 
      className={clsx(
        "block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border bg-white",
        error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "",
        className
      )} 
    >
        {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
    children, 
    variant = 'primary', 
    className, 
    ...props 
}) => {
    const base = "inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 focus:ring-primary-500",
        outline: "bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50 focus:ring-primary-500"
    };

    return (
        <button className={clsx(base, variants[variant], className)} {...props}>
            {children}
        </button>
    );
};
