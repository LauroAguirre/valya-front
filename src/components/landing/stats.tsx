const stats = [
  { value: '500+', label: 'Corretores ativos' },
  { value: '50.000+', label: 'Leads qualificados' },
  { value: '73%', label: 'Taxa de resposta da IA' },
  { value: '24/7', label: 'Disponibilidade garantida' },
]

export function Stats() {
  return (
    <section className="bg-[#FF6600] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl font-bold text-white md:text-4xl"
                style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
              >
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
