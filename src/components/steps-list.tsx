type Step = { title: string; description: string };

export function StepsList({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary font-serif text-primary-foreground">
            {i + 1}
          </span>
          <h3 className="mt-4 font-serif text-lg">{step.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
