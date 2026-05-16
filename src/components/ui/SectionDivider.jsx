export default function SectionDivider({ variant = 1 }) {
  const paths = {
    1: 'M0,40 C150,120 300,0 600,60 C900,120 1050,30 1200,60 L1200,0 L0,0 Z',
    2: 'M0,60 C200,0 400,100 600,50 C800,0 1000,80 1200,40 L1200,0 L0,0 Z',
    3: 'M0,50 C150,90 350,10 600,55 C850,100 1000,20 1200,50 L1200,0 L0,0 Z',
  };

  const colors = {
    1: 'fill-amber-200',
    2: 'fill-cream-dark',
    3: 'fill-amber-100',
  };

  return (
    <div className="relative h-16 md:h-24 -mt-1 overflow-hidden">
      <svg
        className={`absolute bottom-0 w-full h-full ${colors[variant] || colors[1]}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d={paths[variant] || paths[1]} />
      </svg>
    </div>
  );
}
