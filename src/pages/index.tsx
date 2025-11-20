import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BellRing, CloudSun } from "lucide-react";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-1 w-full flex-col gap-24 text-[var(--color-dark-cyan)]">
      <section className="relative pb-10 sm:-mt-6 sm:-mx-4 md:-mx-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <img
            src="/images/imagem-organica.png"
            alt="Elemento orgânico"
            // className="absolute top-0 right-0 w-[1200px] max-w-none object-contain opacity-95"
            className="absolute top-0 right-[-7rem] w-[70rem] object-contain opacity-95"
          />
        </div>
        <div className="mx-auto grid w-full max-w-[1200px] items-start gap-10 px-4 sm:px-6 lg:px-0 lg:max-w-[1800px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-4 px-6 py-10 lg:pt-28">
            <p className="font-londrina text-[6rem] leading-none text-[var(--color-dark-green)]">
              Atmos
            </p>
            <p className="text-[32px] font-bold text-[var(--card-foreground)] leading-relaxed">
              Transforme Dados em Decisão.<br className="hidden sm:block" />
              Gestão Inteligente de Estações<br className="hidden sm:block" />
              Meteorológicas.
            </p>
            <p className="text-[20px] text-[var(--card-foreground)] font-semibold leading-relaxed">
              Em parceria com a Tecsus, o Atmos é a sua ferramenta<br className="hidden sm:block" />
              moderna e responsiva de monitoramento climático e do solo,<br className="hidden sm:block" />
              focada em proteger as áreas mais vulneráveis.
            </p>
            <Link href="/estacoes" className="inline-block">
              <Button
                className="bg-[var(--color-green)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--color-dark-green)]"
                style={{ borderRadius: "18px" }}
              >
                Ver o que está acontecendo
              </Button>
            </Link>
          </div>
          <div className="relative flex min-h-[360px] items-center justify-center sm:min-h-[420px] lg:min-h-[520px] lg:items-start lg:justify-end lg:translate-x-48">
            <div
              aria-hidden
              className="absolute -top-10 right-4 hidden h-[420px] w-[420px] rounded-[46%] bg-white/20 blur-3xl lg:block"
            />
            <div
              aria-hidden
              className="absolute -bottom-4 left-0 hidden h-60 w-60 rounded-[40%] bg-white/15 blur-2xl lg:block"
            />
            <div
              aria-hidden
              className="absolute -top-16 right-10 hidden h-[360px] w-[360px] rounded-[50%]"
            />
            <div
              aria-hidden
              className="absolute top-20 right-40 hidden h-[320px] w-[390px] rounded-[45%]"
            />
            <div className="relative w-full max-w-[320px] sm:max-w-[520px] lg:max-w-[800px] lg:ml-auto lg:pr-12 lg:pl-8 lg:-translate-x-16 lg:translate-y-16">
              <Image
                src="/images/ZenBook-Duo-14.png"
                alt="Notebook exibindo a plataforma Atmos"
                width={800}
                height={600}
                priority
                className="relative z-12 w-full drop-shadow-[0_28px_50px_rgba(0,49,45,0.35)]"
              />
            </div>
            <Image
              src="/images/iPhone-13-Pro.png"
              alt="Aplicativo Atmos no smartphone"
              width={150}
              height={214}
              priority
              className="absolute bottom-0 left-6 w-[110px] drop-shadow-[0_18px_36px_rgba(0,49,45,0.35)] sm:-bottom-4 sm:left-12 sm:w-[130px] md:bottom-auto md:left-16 md:top-40 md:w-[140px] lg:-left-20 lg:top-44 lg:w-[150px]"
            />
          </div>
        </div>
        <div className="mx-auto mt-16 grid w-full max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:mt-40 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
          <div>
            <p className="text-[32px] font-lato font-bold text-[var(--color-dark-green)] leading-tight lg:translate-x-60">
              Pouco Mais<br className="hidden sm:block" />
              Sobre o Atmos
            </p>
          </div>
          <div>
            <p className="font-lato text-[20px] text-[var(--color-dark-cyan)] leading-relaxed">
              Conecte <strong>novas estações</strong>, configure individualmente os <strong>parâmetros</strong> e defina <strong>tipos de alerta</strong> customizados para condições específicas. Todos os dados coletados são visualizados
              em <strong>Dashboards</strong> gráficos com filtros avançados, complementados por um <strong>relatório</strong> que fornece
              insights mensais essenciais para uma gestão de riscos eficaz.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-16 grid w-full max-w-[100rem] items-stretch gap-8 px-4 sm:px-6 lg:mt-30 lg:px-10 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)]">
          <div className="flex h-full flex-col gap-10">
            <div className="min-h-[235px] w-full max-w-[35rem] rounded-[28px] border-[2px] border-[#72BF01] bg-white p-6 shadow-sm mx-auto lg:mx-0">
              <p className="font-lato font-bold text-[var(--color-dark-green)] text-[32px]">Estações</p>
              <p className="mt-3 font-lato text-[18px] font-bold text-[var(--color-dark-cyan)] leading-relaxed">
                Cada estação é equipada com sensores avançados para a captura de dados de forma contínua e precisa.
              </p>
            </div>
            <div className="min-h-[235px] w-full max-w-[35rem] rounded-[28px] border-[2px] border-[#72BF01] bg-white p-6 shadow-sm mx-auto lg:mx-0">
              <p className="font-lato text-lg font-bold text-[32px] text-[var(--color-dark-green)]">Alertas</p>
              <p className="mt-3 font-lato text-[18px] font-bold text-[var(--color-dark-cyan)] leading-relaxed">
                Seja notificado sobre mudanças climáticas e evite surpresas. Proteja sua comunidade e seu ambiente.
              </p>
            </div>
          </div>
          <div className="flex h-full flex-col items-center lg:items-center lg:justify-center">
            <div className="w-full rounded-[28px] border-[2px] border-[#72BF01] bg-white p-6 sm:p-8 lg:min-h-full">
              <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
                <img
                  src="/images/boy.png"
                  alt="Criança segurando desenho de sapo"
                  className="h-[200px] w-[200px] rounded-[10px] object-cover sm:h-[240px] sm:w-[240px] lg:h-[28rem] lg:w-[20rem]"
                ></img>
                <div className="space-y-6 text-center lg:flex-1 lg:text-left">
                  <p className="font-lato text-[32px] font-semibold  text-[var(--color-dark-green)]">
                    Descubra Como Nossa<br className="hidden sm:block" />
                    Aplicação Funciona
                  </p>
                  <p className="text-[18px] font-bold text-[var(--color-dark-cyan)] leading-relaxed">
                    Explore o nosso guia educativo e compreenda a importância e funcionamento do projeto. Veja como os dados da Atmos
                    podem orientar ações educativas e estratégicas com segurança.
                  </p>
                  <Link href="/estacoes" className="inline-flex lg:justify-end">
                    <Button
                      className="bg-[var(--color-green)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--color-dark-green)]"
                      style={{ borderRadius: "18px" }}
                    >
                      Ir para o Guia Educativo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
