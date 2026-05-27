interface BadgeProps {
  label: string;
  value: string;
  className?: string;
}

export default function Badge({ label, value, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex flex-col items-start gap-0.5 ${className}`}>
      <span className="text-[10px] tracking-widest uppercase text-muted font-sans">{label}</span>
      <span className="text-xs font-medium text-charcoal font-sans capitalize">{value.replace(/_/g, " ")}</span>
    </span>
  );
}
