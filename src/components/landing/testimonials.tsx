const testimonials = [
  {
    name: 'Rodrigo Almeida',
    role: 'Corretor autônomo · São Paulo, SP',
    content:
      'Antes eu ficava horas respondendo WhatsApp de leads que nem sabiam o que queriam. Agora a IA faz isso por mim e eu só entro em contato com quem já quer marcar visita. Triplicou minha produtividade.',
  },
  {
    name: 'Camila Prado',
    role: 'Corretora · Curitiba, PR',
    content:
      'No começo fiquei com medo da IA afastar os clientes, mas foi o contrário. Os leads respondem mais rápido e chegam muito mais qualificados. O trial de 30 dias me convenceu na primeira semana.',
  },
  {
    name: 'Felipe Nascimento',
    role: 'Corretor · Rio de Janeiro, RJ',
    content:
      'O dashboard me deu uma visão que eu nunca tive do meu negócio. Sei exatamente onde estão meus leads, quantos estão quentes e o que a IA está conversando com cada um.',
  },
]

export function Testimonials() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF6600]">
            Depoimentos
          </p>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-balance text-[#003366] md:text-4xl"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Quem usa, não abre mão
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map(t => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-[#FF6600]">
                    ★
                  </span>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-gray-600 italic">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p
                  className="font-semibold text-[#003366]"
                  style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
                >
                  {t.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
