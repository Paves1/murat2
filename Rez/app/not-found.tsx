import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Sayfa Bulunamadı</h2>
        <p className="text-xl text-gray-600 mb-8">Üzgünüz, aradığınız sayfayı bulamadık.</p>
        <Link href="/" className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}

