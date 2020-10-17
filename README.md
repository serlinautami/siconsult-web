# SI Consult - Web
Website untuk menampung dan menampilkan laporan yang dibagikan pada aplikasi SI Consult

### Informasi
- Author:Serlina Utami
- Platform: Android
- Teknologi: Javascript, React, Firebase, Node JS, HTML, CSS, Create React App
- Demo: [siconsult-web.vercel.app](https://siconsult-web.vercel.app/ "https://siconsult-web.vercel.app")

### Cara menjalankan project
Project Web ini dibuat dengan CRA (Project Wrapper untuk React JS / Web). Guide nya bisa baca dulu disini: https://create-react-app.dev/docs/getting-started/


Clone dulu repositori ini:
```
git clone https://github.com/serlinautami/siconsult-web.git
```
Setelah selesai, masuk folder project-nya lalu jalankan perintah. berikut:
```
// jika pakai npm
npm install

// jika pakai yarn
yarn install
```
Catatan: Pastikan sudah terinstall Node JS, dan NPM versi terbaru. Rekomendasi untuk pakai `yarn` .

Setelah package terinstall, jalankan perintah
```
// npm
npm start

// yarn
yarn start
```
Project web akan berjalan pada `http://localhost:3000`

### Setup Firebase
Project ini memiliki dependensi Firebase. Untuk konfigurasinya ada pada file `appConfig.js` pada folder `src/configs`. untuk setupnya harus sama sama seperti pada repository aplikasinya.

Url untuk laporan ada pada endpoint: `/laporan`


