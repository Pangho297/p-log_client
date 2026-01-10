interface Props {
  level: string;
}

export function Heading({ level }: Props) {
  return (
    <div className="font-hold font-[serif]">
      H<span className="text-xs">{level}</span>
    </div>
  );
}
