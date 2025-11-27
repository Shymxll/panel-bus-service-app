import { Link } from 'react-router-dom';
import { 
  Bus, Shield, QrCode, BarChart3, ArrowRight, CheckCircle2, Sparkles, Zap, 
  Users, Clock, MapPin, Smartphone, TrendingUp, Award, Star, 
  CheckCircle, PhoneCall, Mail, Building2, Calendar, Layers
} from 'lucide-react';
import { Button } from '@/components/common/Button';

// Uygulamanin halka acik tanitim sayfasi.
export const LandingPage = () => {
  // Kartlarda gosterilecek ozellik tanimlari.
  const features = [
    {
      icon: QrCode,
      title: 'QR Kod İzləmə',
      description: 'Şagirdlərin minmə və düşmə proseslərini QR kod ilə asanlıqla izləyin. Hər şagird üçün unikal QR kod yaradın və anında təqib edin.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: Bus,
      title: 'Avtobus İdarəçiliyi',
      description: 'Bütün avtobusları, şoförləri və marşrutları vahid platformadan idarə edin. Real vaxtda GPS izləmə və marşrut planlaması.',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      icon: Shield,
      title: 'Maksimum Təhlükəsizlik',
      description: 'JWT autentifikasiya, SSL şifrələmə və rol əsaslı giriş ilə məlumatlarınız tam qorunur.',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      icon: BarChart3,
      title: 'Təfərrüatlı Hesabatlar',
      description: 'Günlük, həftəlik və aylıq hesabatlarla məlumatları təhlil edin. Excel və PDF olaraq ixrac edin.',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
    },
    {
      icon: Clock,
      title: 'Real Vaxt İzləmə',
      description: 'Hər bir avtobusun və şagirdin real vaxtda harada olduğunu görün.',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50',
    },
    {
      icon: Users,
      title: 'İstifadəçi İdarəçiliyi',
      description: 'Adminlər, şoförlər və valideynlər üçün ayrı-ayrı panel və səlahiyyətlər.',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
    },
    {
      icon: MapPin,
      title: 'Marşrut Planlaması',
      description: 'Ən optimal marşrutları yaradın və duracaqları asanlıqla idarə edin.',
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-50 to-blue-50',
    },
    {
      icon: Smartphone,
      title: 'Mobil Uyğunluq',
      description: 'İstənilən cihazdan - telefon, planşet və ya kompüterdən istifadə edin.',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
  ];

  // Servisin avantajlarini listeleyen metinler.
  const benefits = [
    'Real vaxtda izləmə və bildirişlər',
    'QR kod texnologiyası ilə sürətli qeydiyyat',
    'Bank səviyyəsində təhlükəsiz məlumat saxlanması',
    'İntuitiv və asan istifadə interfeysi',
    'Bütün cihazlarda mükəmməl işləyir',
    'Təfərrüatlı hesabat və analitika',
  ];

  // İstatistikler
  const stats = [
    { value: '1000+', label: 'Aktiv Şagird', icon: Users },
    { value: '50+', label: 'Avtobus', icon: Bus },
    { value: '99.9%', label: 'Əlçatanlıq', icon: TrendingUp },
    { value: '24/7', label: 'Dəstək', icon: Shield },
  ];

  // Müştəri rəyləri
  const testimonials = [
    {
      name: 'Leyla Məmmədova',
      role: 'Məktəb Direktoru',
      company: '151 nömrəli Məktəb',
      content: 'Bu sistem bizim məktəbin servis idarəçiliyini tamamilə dəyişdirdi. İndi valideynlər də uşaqlarının hara olduğunu görə bilirlər.',
      rating: 5,
      avatar: 'LM'
    },
    {
      name: 'Rəşad Əliyev',
      role: 'Servis Müdiri',
      company: 'Təhsil Mərkəzi',
      content: 'Real vaxt izləmə funksiyası əla işləyir. Bütün avtobusları eyni ekranda görmək böyük rahatlıqdır.',
      rating: 5,
      avatar: 'RƏ'
    },
    {
      name: 'Nigar Həsənova',
      role: 'Valideyn',
      company: '',
      content: 'Uşağımın avtobusa minib-düşdüyünü telefona bildiriş gəlir. Artıq narahat olmuram. Təşəkkür edirəm!',
      rating: 5,
      avatar: 'NH'
    },
  ];

  // Necə işləyir addımları
  const howItWorks = [
    {
      step: '01',
      title: 'Qeydiyyat',
      description: 'Sistemə daxil olun və şagird, avtobus və marşrut məlumatlarını daxil edin',
      icon: Calendar,
    },
    {
      step: '02',
      title: 'QR Kod Yaradın',
      description: 'Hər şagird üçün avtomatik unikal QR kod yaradılır və çap edilir',
      icon: QrCode,
    },
    {
      step: '03',
      title: 'İzləmə',
      description: 'Şoförlər QR kodu skan edərək şagirdlərin minib-düşməsini qeyd edir',
      icon: Smartphone,
    },
    {
      step: '04',
      title: 'Hesabatlar',
      description: 'Real vaxtda hesabat və bildirişlər alın. Bütün məlumatları təhlil edin',
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-secondary-200">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">Panel Bus</span>
            </div>
            <Link to="/admin/login">
              <Button size="sm" className="shadow-md hover:shadow-lg transition-shadow">
                Daxil ol
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero bolumu */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 pt-24">
        {/* Animasyonlu arka plan objeleri */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 rounded-full bg-primary-300/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative container-custom py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              {/* Baslik uzerindeki rozet */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 mb-8">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium text-white">2025-ci ilin ən yaxşı həlləri</span>
                <Award className="h-4 w-4 text-yellow-300" />
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                Məktəb Servisi
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                  İdarəetmə Sistemi
                </span>
              </h1>
              <p className="mt-6 text-xl sm:text-2xl text-primary-100 leading-relaxed">
                QR kod texnologiyası ilə şagirdlərin servis hərəkətlərini{' '}
                <span className="font-semibold text-white">real vaxtda</span> izləyin və idarə edin.
                Valideynlərə tam nəzarət və rahatlıq təqdim edin.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/admin/login">
                  <Button
                    size="lg"
                    className="group bg-white text-primary-600 hover:bg-white/90 hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl px-8 py-4 text-lg font-semibold"
                    rightIcon={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                  >
                    Başlayın
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="group bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold"
                >
                  Demo İzlə
                </Button>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">SSL Təhlükəsiz</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">99.9% Əlçatanlıq</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">24/7 Dəstək</span>
                </div>
              </div>
            </div>

            {/* Hero visual card */}
            <div className="relative lg:block hidden">
              <div className="relative rounded-3xl bg-white p-8 shadow-2xl">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-secondary-200">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                        <Bus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-secondary-900">Dashboard</div>
                        <div className="text-sm text-secondary-600">Real vaxt izləmə</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Aktiv Şagird', value: '847', color: 'from-blue-500 to-cyan-500' },
                      { label: 'Avtobus', value: '42', color: 'from-green-500 to-emerald-500' },
                      { label: 'Marşrut', value: '28', color: 'from-purple-500 to-pink-500' },
                      { label: 'Şofər', value: '38', color: 'from-orange-500 to-red-500' },
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-secondary-50 rounded-xl p-4">
                        <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-secondary-600 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Activity */}
                  <div className="space-y-3">
                    {[
                      { name: 'Əli Məmmədov', action: 'Avtobusa mindi', time: '2 dəq əvvəl', status: 'success' },
                      { name: 'Leyla Həsənova', action: 'Avtobusdan düşdü', time: '5 dəq əvvəl', status: 'success' },
                      { name: 'Rəşad Əliyev', action: 'Avtobusa mindi', time: '8 dəq əvvəl', status: 'success' },
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <div className="flex-1">
                          <div className="font-medium text-secondary-900 text-sm">{activity.name}</div>
                          <div className="text-xs text-secondary-600">{activity.action}</div>
                        </div>
                        <div className="text-xs text-secondary-500">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="bg-white py-20 border-y border-secondary-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center group">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-extrabold text-secondary-900 mb-2">{stat.value}</div>
                  <div className="text-secondary-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ozellikler bolumu */}
      <div className="container-custom py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4">
            <Zap className="h-5 w-5" />
            <span>Xüsusiyyətlər</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4">
            Güclü və Modern Həllər
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Modern texnologiya ilə gücləndirilmiş idarəetmə sistemi. Məktəb servisi idarəçiliyində ehtiyac duyacağınız hər şey bir yerdə.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-secondary-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Hover durumunda gradient katman */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-secondary-900 group-hover:text-secondary-950 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-secondary-600 group-hover:text-secondary-700 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Necə işləyir */}
      <div className="bg-gradient-to-br from-secondary-50 to-white py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4">
              <Layers className="h-5 w-5" />
              <span>Proses</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4">
              Necə İşləyir?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Sadə 4 addımda sistemə başlayın və servis idarəçiliyinizi fərqli səviyyəyə çıxarın
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative">
                  {/* Connecting line */}
                  {idx < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent -translate-x-8" />
                  )}
                  
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-secondary-200">
                    <div className="text-6xl font-extrabold text-primary-100 mb-4">{item.step}</div>
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 mb-4 shadow-lg">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-3">{item.title}</h3>
                    <p className="text-secondary-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Avantajlar bolumu */}
      <div className="bg-white py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 p-8 shadow-2xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 rounded-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Bus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">Real vaxtda izləmə</div>
                      <div className="text-primary-100 text-sm">Hər addımı görün</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: 1, name: 'Şagird #847', status: 'Marşrutda', progress: 85 },
                      { id: 2, name: 'Şagird #523', status: 'Mindi', progress: 95 },
                      { id: 3, name: 'Şagird #234', status: 'Düşdü', progress: 100 },
                    ].map((student) => (
                      <div key={student.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{student.name}</span>
                          <span className="text-primary-100 text-sm px-2 py-1 bg-white/10 rounded-lg">{student.status}</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-white to-primary-100 rounded-full transition-all duration-1000"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <span>Üstünlüklər</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-6">
                Niyə Panel Bus?
              </h2>
              <p className="text-lg text-secondary-600 mb-8">
                Məktəb servisi idarəetməsini sadələşdirən, təhlükəsizliyi təmin edən və valideynlərə rahatlıq gətirən ən müasir həll
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-4 group p-4 rounded-xl hover:bg-secondary-50 transition-colors">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-secondary-900 font-medium text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Müştəri rəyləri */}
      <div className="bg-gradient-to-br from-secondary-50 to-white py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4">
              <Star className="h-5 w-5 fill-primary-600" />
              <span>Müştəri Rəyləri</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4">
              Müştərilərimiz Nə Deyir?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Minlərlə istifadəçi artıq Panel Bus-a güvənir
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-secondary-200">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-secondary-700 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-secondary-900">{testimonial.name}</div>
                    <div className="text-sm text-secondary-600">
                      {testimonial.role} {testimonial.company && `• ${testimonial.company}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Panel Bus</span>
              </div>
              <p className="text-secondary-400 leading-relaxed">
                Məktəb servisi idarəetməsi üçün ən müasir və təhlükəsiz həll
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Məhsul</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">Xüsusiyyətlər</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Qiymətlər</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Şirkət</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">Haqqımızda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bloq</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karyera</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tərəfdaşlar</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Əlaqə</h3>
              <ul className="space-y-3 text-secondary-400">
                <li className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  <span>+994 XX XXX XX XX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@panelbus.az</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Bakı, Azərbaycan</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-secondary-400 text-sm">
                © 2025 Panel Bus. Bütün hüquqlar qorunur.
              </p>
              <div className="flex gap-6 text-secondary-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Məxfilik Siyasəti</a>
                <a href="#" className="hover:text-white transition-colors">İstifadə Şərtləri</a>
                <a href="#" className="hover:text-white transition-colors">Çerez Siyasəti</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

