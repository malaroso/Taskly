# 📱 Proje Tanıtımı
Taskly, ekip çalışmalarını ve proje yönetimini kolaylaştırmak için tasarlanmış modern bir görev yönetim uygulamasıdır. Kullanıcı dostu arayüzü ve zengin özellikleriyle, ekiplerin görevleri organize etmesine, takip etmesine ve tamamlamasına yardımcı olur.


## ✨ Özellikler

- **Kapsamlı Görev Yönetimi**
- Öncelik seviyeli görev oluşturma (Düşük, Orta, Yüksek)
- Durum takibi (Beklemede, Devam Ediyor, Tamamlandı, İptal)
- Son tarih belirleme ve takip etme
- Detaylı görev açıklamaları

- **Ekip İşbirliği**
- Görevlere ekip üyelerini atama
- Gerçek zamanlı yorum sistemi
- Dosya ve fotoğraf eklentileri
- Aksiyon bildirimleri

- **Görsel Zenginlik**
- Lottie animasyonları ile zengin kullanıcı deneyimi
- Öncelik ve durum bazlı renk kodlaması
- Sezgisel kullanıcı arayüzü

- **Organizasyon ve Filtreleme**
- Durum ve önceliğe göre filtreleme
- Kolay erişilebilir görev kartları
- Bildirim merkezi ve okunmayan bildirim göstergeleri

## 🎨 Ekranlar

**🏠 Ana Sayfa (HomeScreen.tsx)**
- Görev durum kartları (Devam Eden, İşlemde, Tamamlandı, İptal)
- Filtrelenmiş görev listesi
- Bildirim ve profil erişimi
- Anlık durum bazlı filtreleme kartları

**📋 Görevler Sayfası (TasksScreen.tsx)**
- Tüm görevlerin listesi
- Öncelik renk kodlaması ile görselleştirme
- Boş durum için "planetr.json" animasyonlu görünüm
- Yükleme durumu için "loader.json" animasyonu

**📝 Görev Detay Sayfası (TaskDetailScreen.tsx)**
- Görev bilgileri ve durum göstergeleri
- Yorum ekleme, düzenleme ve silme
- Dosya eklentileri yönetimi
- Modal ile durum bildirimleri

**➕ Görev Oluşturma Ekranı (AddTaskScreen.tsx)**
- Çok aşamalı görev oluşturma formu
- Fotoğraf ekleme ve açıklama özelliği
- Ekip üyesi atama
- DateTimePicker ile tarih seçimi

**🔔 Bildirimler Ekranı (NotificationScreen.tsx)**
- Okunmamış bildirimler
- "bell-animation.json" ile animasyonlu bildirim arayüzü
- Bildirim okunma durumu takibi
- notificationService.ts ile bildirim verisi yönetimi

**👤 Profil Ekranı (MyProfileScreen.tsx)**
- Kullanıcı bilgileri
- Performans istatistikleri
- Ayarlar yönetimi
- Kullanıcı fotoğrafı ve detayları

## 🛠 Teknoloji Yığını

**Front-End**
- React Native
- TypeScript
- Expo Framework
- React Navigation
- FontAwesome Icons
- Lottie Animations
- State Yönetimi
- Context API (AuthContext.tsx)
- useState ve useEffect hooks
- useFocusEffect ve useCallback
- Styling
- StyleSheet API
- Custom Components
- Responsive Design (Dimensions API)
- API İletişimi
- RESTful API Entegrasyonu
- Axios / Fetch
- Asenkron Veri Yönetimi



##🔑 Anahtar Bileşenler
**📑 Ekranlar**
- HomeScreen.tsx: Kullanıcının ana görev panosunu ve durum filtrelerini görüntüler
- TasksScreen.tsx: Tüm görevlerin listelendiği ekran
- TaskDetailScreen.tsx: Görev detayları, yorumlar ve ekler
- AddTaskScreen.tsx: Yeni görev oluşturma formu
- NotificationScreen.tsx: Bildirim merkezi
- MyProfileScreen.tsx: Kullanıcı profili ve ayarları

**🔄 Servisler**
- taskService.ts: Görev CRUD operasyonları
- notificationService.ts: Bildirim işlemleri ve okunmamış bildirim sayısı
- userService.ts: Kullanıcı bilgilerini yönetme

**⚙️ Yardımcılar**
- taskHelpers.ts: Görev renk kodlaması ve formatlama
- modalHelpers.tsx: Modal bileşenleri ve fonksiyonlarını içerir

**🎭 Animasyonlar**
- loader.json: Veri yüklemesi sırasında gösterilen animasyon
- planetr.json: Boş görev listesi durumu için animasyon
- bell-animation.json: Bildirim ekranında kullanılan animasyon