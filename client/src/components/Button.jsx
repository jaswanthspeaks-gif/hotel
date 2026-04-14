export function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  as: Comp = 'button',
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-forest text-white hover:bg-forest-light focus-visible:outline-forest',
    outline:
      'border border-forest text-forest bg-transparent hover:bg-forest hover:text-white focus-visible:outline-forest',
    ghost: 'text-forest hover:bg-forest/10',
    danger: 'bg-red-700 text-white hover:bg-red-800',
  };
  return (
    <Comp
      type={Comp === 'button' ? type : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}
