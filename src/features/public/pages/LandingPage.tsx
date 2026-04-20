import { Link } from 'react-router-dom';
import { 
  Bus, Shield, QrCode, BarChart3, ArrowRight, CheckCircle2, Sparkles, Zap, 
  Users, Clock, MapPin, Smartphone, TrendingUp, Award, Star, 
  CheckCircle, PhoneCall, Mail, Building2, Calendar, Layers
} from 'lucide-react';
import { Button } from '@/components/common/Button';

export const LandingPage = () => {
  const features = [
    {
      icon: QrCode,
      title: 'QR Kod Takibi',
      description: 'Öğrencilerin biniş ve iniş süreçlerini QR kod ile kolayca takip edin. Her öğrenci için benzersiz QR kod oluşturun ve anında takip edin.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: Bus,
      title: 'Otobüs Yönetimi',
      description: 'Tüm otobüsleri, sürücüleri ve güzergahları tek platformdan yönetin. Gerçek zamanlı GPS takibi ve güzergah planlaması.',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      icon: Shield,
      title: 'Maksimum Güvenlik',
      description: 'JWT kimlik doğrulama, SSL şifreleme ve rol tabanlı erişim ile verileriniz tam olarak korunur.',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      icon: BarChart3,
      title: 'Ayrıntılı Raporlar',
      description: 'Günlük, haftalık ve aylık raporlarla verileri analiz edin. Excel ve PDF olarak dışa aktarın.',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
    },
    {
      icon: Clock,
      title: 'Gerçek Zamanlı Takip',
      description: 'Her otobüsün ve öğrencinin gerçek zamanlı olarak nerede olduğunu görün.',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50',
    },
    {
      icon: Users,
      title: 'Kullanıcı Yönetimi',
      description: 'Yöneticiler ve sürücüler için ayrı panel ve yetkiler. Rol tabanlı erişim sistemi.',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
    },
    {
      icon: MapPin,
      title: 'Güzergah Planlaması',
      description: 'En optimal güzergahları oluşturun ve durakları kolayca yönetin.',
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-50 to-blue-50',
    },
    {
      icon: Smartphone,
      title: 'Mobil Uyumluluk',
      description: 'İstediğiniz cihazdan - telefon, tablet veya bilgisayardan kullanın.',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
  ];

  const benefits = [
    'Gerçek zamanlı takip ve bildirimler',
    'QR kod teknolojisi ile hızlı kayıt',
    'Banka seviyesinde güvenli veri depolama',
    'Sezgisel ve kullanımı kolay arayüz',
    'Tüm cihazlarda mükemmel çalışır',
    'Ayrıntılı rapor ve analitik',
  ];

  const stats = [
    { value: '1000+', label: 'Aktif Öğrenci', icon: Users },
    { value: '50+', label: 'Otobüs', icon: Bus },
    { value: '99.9%', label: 'Erişilebilirlik', icon: TrendingUp },
    { value: '24/7', label: 'Destek', icon: Shield },
  ];

  const testimonials = [
    {
      name: 'Leyla Mammadova',
      role: 'Okul Müdürü',
      company: '151 No\'lu Okul',
      content: 'Bu sistem okulumuzun servis yönetimini tamamen değiştirdi. Artık veliler de çocuklarının nerede olduğunu görebiliyor.',
      rating: 5,
      avatar: 'LM'
    },
    {
      name: 'Raşad Aliyev',
      role: 'Servis Müdürü',
      company: 'Eğitim Merkezi',
      content: 'Gerçek zamanlı takip özelliği harika çalışıyor. Tüm otobüsleri aynı ekranda görmek büyük bir kolaylık.',
      rating: 5,
      avatar: 'RA'
    },
    {
      name: 'Ali Guliyev',
      role: 'Sürücü',
      company: 'Okul Servisi',
      content: 'QR kod okuma sistemi çok hızlı çalışıyor. Öğrencileri kaydetmek artık saniyeler içinde gerçekleşiyor.',
      rating: 5,
      avatar: 'AG'
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Kayıt',
      description: 'Sisteme giriş yapın ve öğrenci, otobüs ve güzergah bilgilerini girin',
      icon: Calendar,
    },
    {
      step: '02',
      title: 'QR Kod Oluşturun',
      description: 'Her öğrenci için otomatik benzersiz QR kod oluşturulur ve yazdırılır',
      icon: QrCode,
    },
    {
      step: '03',
      title: 'Takip',
      description: 'Sürücüler QR kodu tarayarak öğrencilerin biniş-inişini kaydeder',
      icon: Smartphone,
    },
    {
      step: '04',
      title: 'Raporlar',
      description: 'Gerçek zamanlı rapor ve bildirimler alın. Tüm verileri analiz edin',
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
            <div className="flex items-center gap-2">
              <Link to="/admin/login">
                <Button variant="outline" size="sm">
                  Yönetici
                </Button>
              </Link>
              <Link to="/driver/login">
                <Button variant="outline" size="sm">
                  Sürücü
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 rounded-full bg-primary-300/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative container-custom py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 mb-8">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium text-white">2025 yılının en iyi çözümleri</span>
                <Award className="h-4 w-4 text-yellow-300" />
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                Okul Servisi
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                  Yönetim Sistemi
                </span>
              </h1>
              <p className="mt-6 text-xl sm:text-2xl text-primary-100 leading-relaxed">
                QR kod teknolojisi ile öğrencilerin servis hareketlerini{' '}
                <span className="font-semibold text-white">gerçek zamanlı</span> takip edin ve yönetin.
                Okul servisi yönetiminde yeni standart.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/admin/login">
                  <Button
                    size="lg"
                    className="group bg-white text-primary-600 hover:bg-white/90 hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl px-8 py-4 text-lg font-semibold"
                    rightIcon={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                  >
                    Yönetici Girişi
                  </Button>
                </Link>
                <Link to="/driver/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold"
                  >
                    Sürücü Girişi
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">SSL Güvenli</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">%99.9 Erişilebilirlik</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">7/24 Destek</span>
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
                        <div className="font-bold text-secondary-900">Panel</div>
                        <div className="text-sm text-secondary-600">Gerçek zamanlı takip</div>
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
                      { label: 'Aktif Öğrenci', value: '847', color: 'from-blue-500 to-cyan-500' },
                      { label: 'Otobüs', value: '42', color: 'from-green-500 to-emerald-500' },
                      { label: 'Güzergah', value: '28', color: 'from-purple-500 to-pink-500' },
                      { label: 'Sürücü', value: '38', color: 'from-orange-500 to-red-500' },
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
                      { name: 'Ali Mammadov', action: 'Otobüse bindi', time: '2 dk önce', status: 'success' },
                      { name: 'Leyla Hasanova', action: 'Otobüsten indi', time: '5 dk önce', status: 'success' },
                      { name: 'Raşad Aliyev', action: 'Otobüse bindi', time: '8 dk önce', status: 'success' },
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

      {/* Özellikler */}
      <div className="container-custom py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4">
            <Zap className="h-5 w-5" />
            <span>Özellikler</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4">
            Güçlü ve Modern Çözümler
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Modern teknoloji ile güçlendirilmiş yönetim sistemi. Okul servisi yönetiminde ihtiyacınız olan her şey tek yerde.
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

      {/* Nasıl Çalışır */}
      <div className="bg-gradient-to-br from-secondary-50 to-white py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4">
              <Layers className="h-5 w-5" />
              <span>Süreç</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Basit 4 adımda sisteme başlayın ve servis yönetiminizi farklı bir seviyeye taşıyın
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative">
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

      {/* Avantajlar */}
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
                      <div className="text-white font-bold text-lg">Gerçek zamanlı takip</div>
                      <div className="text-primary-100 text-sm">Her adımı görün</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: 1, name: 'Öğrenci #847', status: 'Güzergahta', progress: 85 },
                      { id: 2, name: 'Öğrenci #523', status: 'Bindi', progress: 95 },
                      { id: 3, name: 'Öğrenci #234', status: 'İndi', progress: 100 },
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
                <span>Avantajlar</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-6">
                Neden Panel Bus?
              </h2>
              <p className="text-lg text-secondary-600 mb-8">
                Okul servisi yönetimini basitleştiren, güvenliği sağlayan ve öğrenci güvenliğini artıran en modern çözüm
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

      {/* Müşteri Yorumları */}
      <div className="bg-gradient-to-br from-secondary-50 to-white py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4">
              <Star className="h-5 w-5 fill-primary-600" />
              <span>Müşteri Yorumları</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Binlerce kullanıcı artık Panel Bus'a güveniyor
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
                Okul servisi yönetimi için en modern ve güvenli çözüm
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Ürün</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">Özellikler</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fiyatlar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Şirket</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İş Ortakları</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">İletişim</h3>
              <ul className="space-y-3 text-secondary-400">
                <li className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  <span>+90 XXX XXX XX XX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@panelbus.com.tr</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Türkiye</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-secondary-400 text-sm">
                © 2025 Panel Bus. Tüm hakları saklıdır.
              </p>
              <div className="flex gap-6 text-secondary-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
                <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
                <a href="#" className="hover:text-white transition-colors">Çerez Politikası</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
